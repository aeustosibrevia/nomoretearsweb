const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const {Op} = require('sequelize');
const {sendResetEmail} = require('../utils/email');
const createError = require('http-errors');

const SALT_ROUNDS = 12;


function toPublic(u) {
    return {
        id: u.id,
        username: u.username,
        email: u.email,
        role: u.role,
        isSuperAdmin: !!u.is_superadmin
    };
}

async function findActiveUserByUsername(username) {
    if (!username || typeof username !== 'string' || !username.trim()) {
        throw createError(400, 'username є обовʼязковим.');
    }
    const target = await User.findOne({
        where: { username: { [Op.iLike]: username.trim() } },
        attributes: ['id', 'username', 'email', 'role', 'is_active', 'is_superadmin']
    });
    if (!target || !target.is_active) {
        throw createError(404, 'Користувача не знайдено або він неактивний.');
    }
    return target;
}

function ensureAdmin(currentUser) {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.isSuperAdmin !== true)) {
        throw createError(403, 'Тільки адміністратор може виконувати цю дію.');
    }
}

function ensureSuperAdmin(currentUser) {
    if (!currentUser || currentUser.isSuperAdmin !== true) {
        throw createError(403, 'Лише супер-адміністратор може виконувати цю дію.');
    }
}

exports.register = async ({username, password, email, first_name, last_name}) => {
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
        is_active: true,
        first_name: first_name,
        last_name: last_name,
        is_superadmin: false
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
            username: user.username,
            role: user.role,
            isSuperAdmin: !!user.is_superadmin
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
            email: user.email,
            role: user.role,
            isSuperAdmin: !!user.is_superadmin
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
        createdAt: user.created_at,
        role: user.role,
        profile_picture: user.profile_picture,
        phone_number: user.phone_number,
        birthday: user.birthday,
        first_name: user.first_name,
        last_name: user.last_name
    };
};

exports.updateProfile = async (authUser, body) => {
    const { email, profile_picture, phone_number, birthday, first_name, last_name } = body;

    const user = await User.findByPk(authUser.userId);
    if (!user || !user.is_active) {
        throw createError(404, 'Користувача не знайдено');
    }

    if (email && email.trim().toLowerCase() !== user.email) {
        const emailExists = await User.findOne({
            where: { email: email.trim().toLowerCase() }
        });
        if (emailExists) {
            throw createError(409, 'Цей email уже використовується');
        }
        user.email = email.trim().toLowerCase();
    }

    if (profile_picture !== undefined) {
        user.profile_picture = profile_picture.trim();
    }

    if (phone_number !== undefined) {
        const cleaned = phone_number.replace(/[^\d]/g, ''); // оставляем только цифры
        if (cleaned.length < 7 || cleaned.length > 15) {
            throw createError(400, 'Невірний номер телефону');
        }
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
        if (!phoneRegex.test(phone_number)) {
            throw createError(400, 'Невірний формат номера телефону');
        }
        user.phone_number = phone_number.trim();
    }

    if (birthday !== undefined) {
        const date = new Date(birthday);
        if (isNaN(date.getTime())) {
            throw createError(400, 'Невірний формат дати народження');
        }
        user.birthday = date;
    }

    if (first_name !== undefined) {
        user.first_name = first_name.trim();
    }

    if (last_name !== undefined) {
        user.last_name = last_name.trim();
    }

    await user.save();

    return {
        message: 'Профіль оновлено',
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            profile_picture: user.profile_picture,
            phone_number: user.phone_number,
            birthday: user.birthday,
            first_name: user.first_name,
            last_name: user.last_name
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

    if (newPassword.length < 8) {
        throw createError(400,'Пароль має містити щонайменше 8 символів');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        throw createError(400,'Пароль має містити принаймні одну малу літеру, одну велику літеру та одну цифру');
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

    if (newPassword.length < 8) {
        throw createError(400,'Пароль має містити щонайменше 8 символів');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        throw createError(400,'Пароль має містити принаймні одну малу літеру, одну велику літеру та одну цифру');
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    return {message: 'Пароль успішно оновлено'};
};

exports.getAllUsers = async (user) => {
    if (!user || user.role !== 'admin') {
        throw createError(403, "Тільки адміністратор може переглянути список користувачів.");
    }
    const users = await User.findAll({
        attributes: { exclude: ['password', 'reset_token_expires', 'reset_token'] },
    });

    return {
        message: 'Список користувачів',
        users
    };
}

exports.giveInstructor = async (currentUser, username) => {
    ensureAdmin(currentUser);

    if (!username || typeof username !== 'string' || !username.trim()) {
        throw createError(400, 'username є обовʼязковим.');
    }

    const target = await User.findOne({
        where: { username: { [Op.iLike]: username.trim() } },
        attributes: ['id', 'username', 'email', 'role', 'is_active']
    });

    if (!target || !target.is_active) {
        throw createError(404, 'Користувача не знайдено або він неактивний.');
    }

    if (target.role === 'admin') {
        throw createError(409, 'Неможливо змінити роль адміністратора.');
    }

    if (target.role === 'instructor') {
        return {
            message: 'Користувач уже має роль інструктора.',
            user: { id: target.id, username: target.username, email: target.email, role: target.role }
        };
    }

    target.role = 'instructor';
    await target.save();

    return {
        message: 'Роль інструктора призначено.',
        user: { id: target.id, username: target.username, email: target.email, role: target.role }
    };
};

exports.revokeInstructor = async (currentUser, username) => {
    ensureAdmin(currentUser);

    const target = await findActiveUserByUsername(username);

    if (target.role !== 'instructor') {
        return { message: 'Користувач не має ролі інструктора.', user: toPublic(target) };
    }

    target.role = 'user';
    await target.save();

    return { message: 'Роль інструктора знято.', user: toPublic(target) };
};

exports.giveAdmin = async (currentUser, username) => {
    ensureSuperAdmin(currentUser);

    const target = await findActiveUserByUsername(username);

    if (target.role === 'admin') {
        return { message: 'Користувач уже має роль адміністратора.', user: toPublic(target) };
    }

    target.role = 'admin';
    await target.save();

    return { message: 'Роль адміністратора призначено.', user: toPublic(target) };
};

exports.revokeAdmin = async (currentUser, username) => {
    ensureSuperAdmin(currentUser);

    const target = await findActiveUserByUsername(username);

    const selfId = String(currentUser.userId || currentUser.id);
    if (String(target.id) === selfId) {
        throw createError(409, 'Не можна зняти роль адміністратора із самого себе.');
    }

    if (target.is_superadmin) {
        throw createError(409, 'Неможливо зняти роль: користувач є супер-адміністратором. Спершу зніміть прапорець is_superadmin у БД.');
    }

    const otherAdmins = await User.count({
        where: { role: 'admin', id: { [Op.ne]: target.id } }
    });
    if (target.role === 'admin' && otherAdmins === 0) {
        throw createError(409, 'Неможливо зняти роль: це останній адміністратор.');
    }

    if (target.role !== 'admin') {
        return { message: 'Користувач не має ролі адміністратора.', user: toPublic(target) };
    }

    target.role = 'user';
    await target.save();

    return { message: 'Роль адміністратора знято.', user: toPublic(target) };
};
