const createError = require("http-errors");
const Category = require("../models/category");
const generateSlug = require("../utils/slug");

exports.validateCategory = async (req, res, next) => {
    const { name } = req.body;
    const category = req.category;
    const errors = [];

    if (!name || name.length < 2) {
        errors.push("Назва категорії має містити щонайменше 2 символи");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const slug = generateSlug(name);

        if (name && (!category || name !== category.name)) {
            const existingByName = await Category.findOne({ where: { name } });
            if (existingByName) {
                return next(createError(409, "Категорія з таким ім'ям вже існує."));
            }
        }

        if (!category || slug !== category.slug) {
            const existingBySlug = await Category.findOne({ where: { slug } });
            if (existingBySlug) {
                return next(createError(409, "Категорія з таким slug вже існує."));
            }
        }

        next();
    } catch (err) {
        next(err);
    }
};
