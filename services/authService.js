const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { loadUsers, saveUsers } = require('../repositories/userRepository');
const { sendResetEmail } = require('../utils/email');

const SALT_ROUNDS = 12;

exports.register = async ({ username, password, email }) => {
    const users = await loadUsers();

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Користувач із таким ім’ям уже існує');
    }

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Користувач з такою електронною адресою вже існує');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = {
        id: crypto.randomUUID(),
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: new Date().toISOString(),
        isActive: true
    };

    users.push(newUser);
    await saveUsers(users);

    return {
        message: 'Користувача успішно зареєстровано',
        userId: newUser.id
    };
};

exports.login = async ({ username, password }, ip) => {
    const users = await loadUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.isActive);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Неправильні облікові дані');
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
    const users = await loadUsers();
    const user = users.find(u => u.id === authUser.userId && u.isActive);
    if (!user) throw new Error('Користувача не знайдено');

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
    };
};

exports.updateProfile = async (authUser, body) => {
    const { email } = body;
    const users = await loadUsers();
    const user = users.find(u => u.id === authUser.userId && u.isActive);
    if (!user) throw new Error('Користувач не знайдено');

    if (email && email !== user.email) {
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== user.id)) {
            throw new Error('Цей email уже використовується');
        }
        user.email = email.toLowerCase().trim();
    }

    await saveUsers(users);

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
    const { currentPassword, newPassword } = body;
    const users = await loadUsers();
    const user = users.find(u => u.id === authUser.userId && u.isActive);
    if (!user) throw new Error('Користувача не знайдено');

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) throw new Error('Неправильний поточний пароль');

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await saveUsers(users);

    return { message: 'Пароль успішно змінено' };
};

exports.requestPasswordReset = async (email) => {
    const users = await loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);
    if (!user) return { message: 'Якщо такий email існує, лист з інструкцією буде надіслано' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 15 * 60 * 1000;

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await saveUsers(users);

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    await sendResetEmail(email, resetUrl);

    return { message: 'Якщо такий email існує, лист з інструкцією буде надіслано' };
};

exports.resetPassword = async ({ token, newPassword }) => {
    const users = await loadUsers();
    const user = users.find(u => u.resetToken === token && u.resetTokenExpires > Date.now() && u.isActive);
    if (!user) throw new Error('Недійсний або протермінований токен');

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    delete user.resetToken;
    delete user.resetTokenExpires;
    await saveUsers(users);

    return { message: 'Пароль успішно оновлено' };
};
