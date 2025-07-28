const createError = require('http-errors');
const Course = require('../models/course');

exports.validateReview = async (req, res, next) => {
    const { rating, comment, course_id } = req.body;
    const errors = [];
    const review = req.review;

    if (!review) {
        if (rating === undefined || isNaN(rating) || rating < 1 || rating > 5) {
            errors.push("Оцінка має бути числом від 1 до 5.");
        }
    } else {
        if (rating !== undefined && (isNaN(rating) || rating < 1 || rating > 5)) {
            errors.push("Оцінка має бути числом від 1 до 5.");
        }
    }

    if (comment !== undefined && typeof comment !== 'string') {
        errors.push("Поле comment має бути рядком.");
    }

    if (!review) {
        if (course_id === undefined || isNaN(course_id)) {
            errors.push("Необхідно вказати дійсний course_id.");
        } else {
            try {
                const courseExists = await Course.findByPk(course_id);
                if (!courseExists) {
                    return next(createError(400, "Курсу з таким ID не існує."));
                }
            } catch (err) {
                return next(err);
            }
        }
    } else {
        if (course_id !== undefined) {
            errors.push("Зміну course_id заборонено.");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};
