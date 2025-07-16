const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const {Op} = require('sequelize');
const {sendResetEmail} = require('../utils/email');
const createError = require('http-errors');

const SALT_ROUNDS = 12;

exports.register = async ({username, password, email}) => {
    const existingUserByUsername = await User.findOne({
        where: {username: username.trim().toLowerCase()}
    });
    if (existingUserByUsername) {
        throw createError(409, 'Користувач із таким ім’ям уже існує');
    }

    const existingUserByEmail = await User.findOne({
        where: {email: email.trim().toLowerCase()}
    });
    if (existingUserByEmail) {
        throw createError(409, 'Користувач з такою електронною адресою вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await User.create({
        id: crypto.randomUUID(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        created_at: new Date(),
        role: 'student',
        is_active: true
    });

    return {
        message: 'Користувача успішно зареєстровано',
        userId: newUser.id
    };
};

exports.login = async ({email, password}) => {
    const user = await User.findOne({
        where: {
            email: email.trim().toLowerCase(),
            is_active: true
        }
    });

    if (!user) {
        throw createError(401, 'Неправильні облікові дані');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError(401, 'Неправильні облікові дані');
    }

    const token = jwt.sign(
        {
            userId: user.id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
            issuer: 'auth-server'
        }
    );

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
};

exports.logout = async (user) => {
    console.log(`Користувач вийшов: ${user.username}`);
};

exports.getProfile = async (authUser) => {
    const user = await User.findByPk(authUser.userId);
    if (!user || !user.is_active) {
        throw createError(404, 'Користувача не знайдено');
    }

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
    };
};

exports.updateProfile = async (authUser, body) => {
    const {email} = body;
    const user = await User.findByPk(authUser.userId);
    if (!user || !user.is_active) {
        throw createError(404, 'Користувача не знайдено');
    }

    if (email && email.trim().toLowerCase() !== user.email) {
        const emailExists = await User.findOne({
            where: {email: email.trim().toLowerCase()}
        });
        if (emailExists) {
            throw createError(409, 'Цей email уже використовується');
        }
        user.email = email.trim().toLowerCase();
    }

    await user.save();

    return {
        message: 'Профіль оновлено',
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
};

exports.changePassword = async (authUser, body) => {
    const {currentPassword, newPassword} = body;
    const user = await User.findByPk(authUser.userId);
    if (!user || !user.is_active) {
        throw createError(404, 'Користувача не знайдено');
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
        throw createError(400, 'Неправильний поточний пароль');
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await user.save();

    return {message: 'Пароль успішно змінено'};
};

exports.requestPasswordReset = async (email) => {
    const user = await User.findOne({
        where: {
            email: email.trim().toLowerCase(),
            is_active: true
        }
    });

    if (!user) {
        return {message: 'Якщо такий email існує, лист з інструкцією буде надіслано'};
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.reset_token = resetToken;
    user.reset_token_expires = resetTokenExpires;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendResetEmail(email, resetUrl);

    return {message: 'Якщо такий email існує, лист з інструкцією буде надіслано'};
};

exports.resetPassword = async ({token, newPassword}) => {
    const user = await User.findOne({
        where: {
            reset_token: token,
            reset_token_expires: {[Op.gt]: new Date()},
            is_active: true
        }
    });

    if (!user) {
        throw createError(400, 'Недійсний або протермінований токен');
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    return {message: 'Пароль успішно оновлено'};
};
