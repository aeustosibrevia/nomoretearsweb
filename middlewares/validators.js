const validator = require('validator');

exports.validateRegistration = (req, res, next) => {
    const { username, password, email } = req.body;
    const errors = [];

    if (!username || username.length < 3 || username.length > 30) {
        errors.push('Ім’я користувача має містити від 3 до 30 символів');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Ім’я користувача може містити лише літери, цифри та підкреслення');
    }

    if (!password || password.length < 8) {
        errors.push('Пароль має містити щонайменше 8 символів');
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.push('Пароль має містити принаймні одну малу літеру, одну велику літеру та одну цифру');
    }

    if (!email || !validator.isEmail(email)) {
        errors.push('Введіть коректну електронну адресу');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

exports.validateLogin = (req, res, next) => {
    const { username, password } = req.body;
    const errors = [];

    if (!username || !password) {
        errors.push('Ім’я користувача та пароль обов’язкові');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};