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
    const { email, password } = req.body;
    const errors = [];

    if (!email || !password) {
        errors.push('Ім’я користувача та пароль обов’язкові');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

exports.validateCourse = (req, res, next) => {
    const { title, price, category_id } = req.body;
    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Назва курсу має містити щонайменше 3 символи');
    }

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
        errors.push("Ціна має бути невід'ємним числом");
    }

    if (!category_id || isNaN(category_id)) {
        errors.push('Необхідно вказати дійсний category_id');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

exports.validateCategory = (req, res, next) => {
    const { name, slug } = req.body;
    const errors = [];

    if (!name || name.length < 2) {
        errors.push('Назва категорії має містити щонайменше 2 символи');
    }

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        errors.push('Slug може містити лише малі літери, цифри та дефіси');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};
