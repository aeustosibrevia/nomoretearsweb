const createError = require('http-errors');
const Lesson = require('../models/lesson');

exports.validateQuiz = async (req, res, next) => {
    const { title, lesson_id } = req.body;
    const errors = [];
    const quiz = req.quiz;

    if (!quiz) {
        if (!title || typeof title !== 'string') {
            errors.push("Поле title є обов'язковим і має бути рядком.");
        }
    } else {
        if (title !== undefined && typeof title !== 'string') {
            errors.push("Поле title має бути рядком.");
        }
    }



    if (!quiz) {
        if (lesson_id === undefined || isNaN(lesson_id)) {
            errors.push("Необхідно вказати дійсний lesson_id.");
        } else {
            try {
                const lessonExists = await Lesson.findByPk(lesson_id);
                if (!lessonExists) {
                    return next(createError(400, "Уроку з таким ID не існує."));
                }
            } catch (err) {
                return next(err);
            }
        }
    } else {
        if (lesson_id !== undefined) {
            errors.push("Зміну lesson_id заборонено.");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};
