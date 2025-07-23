const createError = require("http-errors");
const Category = require("../models/category");
const Course = require("../models/course");

exports.validateCourse = async (req, res, next) => {
    const { title, price, category_id } = req.body;
    const errors = [];
    const course = req.course;

    if (!course) {
        if (!title || title.length < 3) {
            errors.push("Назва курсу має містити щонайменше 3 символи");
        }

        if (!category_id || isNaN(category_id)) {
            errors.push("Необхідно вказати дійсний category_id");
        }
    } else {
        if (title !== undefined && title.length < 3) {
            errors.push("Назва курсу має містити щонайменше 3 символи");
        }

        if (category_id !== undefined && isNaN(category_id)) {
            errors.push("Поле category_id має бути числом");
        }
    }

    if (price !== undefined && (isNaN(price) || Number(price) < 0)) {
        errors.push("Ціна має бути невід'ємним числом");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        if ((category_id !== undefined && !isNaN(category_id))) {
            const categoryExists = await Category.findByPk(category_id);
            if (!categoryExists) {
                return next(createError(400, "Категорії з таким ID не існує."));
            }
        }

        if (title && (!course || title !== course.title)) {
            const existingByTitle = await Course.findOne({ where: { title } });
            if (existingByTitle) {
                return next(createError(409, "Курс з такою назвою вже існує."));
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
