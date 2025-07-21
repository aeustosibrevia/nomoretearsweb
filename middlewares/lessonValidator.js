const createError = require('http-errors');
const Course = require('../models/course');

exports.validateLesson = async (req, res, next) => {
    const { title, course_id, video_data, content } = req.body;
    const errors = [];
    const lesson = req.lesson; // если есть — это update

    // 🔹 Валидация title
    if (!lesson) {
        if (!title || title.trim().length < 3) {
            errors.push("Назва уроку має містити щонайменше 3 символи.");
        }
    } else {
        if (title !== undefined && title.trim().length < 3) {
            errors.push("Назва уроку має містити щонайменше 3 символи.");
        }
    }

    // 🔹 Валидация course_id
    if (!lesson) {
        if (course_id === undefined || isNaN(course_id)) {
            errors.push("Необхідно вказати дійсний course_id.");
        }
    } else {
        if (course_id !== undefined && isNaN(course_id)) {
            errors.push("Поле course_id має бути числом.");
        }
    }

    // 🔹 Валидация video_data (если передано)
    if (video_data !== undefined && typeof video_data !== 'string') {
        errors.push("Поле video_data має бути рядком.");
    }

    // 🔹 Валидация content (если передано)
    if (content !== undefined && typeof content !== 'string') {
        errors.push("Поле content має бути рядком.");
    }

    // 🔹 Возврат ошибок
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        // 🔹 Проверка существования курса, только если course_id передан
        if (course_id !== undefined && !isNaN(course_id)) {
            const courseExists = await Course.findByPk(course_id);
            if (!courseExists) {
                return next(createError(400, "Курсу з таким ID не існує."));
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
