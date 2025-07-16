const createError = require("http-errors");
const Category = require("../models/category");

exports.validateCategory = async (req, res, next) => {
    const { name, slug } = req.body;
    const category = req.category;
    const errors = [];

    if (!name || name.length < 2) {
        errors.push("Назва категорії має містити щонайменше 2 символи");
    }

    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
        errors.push("Slug може містити лише малі літери, цифри та дефіси");
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        if (name && (!category || name !== category.name)) {
            const existingByName = await Category.findOne({ where: { name } });
            if (existingByName) {
                return next(createError(409, "Категорія з таким ім'ям вже існує."));
            }
        }

        if (slug && (!category || slug !== category.slug)) {
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
