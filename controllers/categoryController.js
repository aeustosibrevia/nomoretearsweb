const categoryService = require("../services/categoryService");
const createError = require("http-errors");
const Category = require("../models/category");

exports.loadCategory = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return next(createError(404, "Категорію не знайдено."));
        }
        req.category = category;
        next();
    } catch (err) {
        next(err);
    }
};

// POST /api/categories
exports.createCategory = async (req, res, next) => {
    try {
        const result = await categoryService.createCategory(req.body, req.user);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
    try {
        const result = await categoryService.updateCategory(req.params.id, req.body, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /courses
exports.getAllCategories = async (req, res, next) => {
    try {
        const result = await categoryService.getAllCategories();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /courses/:categorySlug
exports.getCoursesByCategorySlug = async (req, res, next) => {
    try {
        const { categorySlug } = req.params;
        const result = await categoryService.getCoursesByCategorySlug(categorySlug);
        if (!result) {
            return next(createError(404, "Категорію не знайдено."));
        }
        res.json(result);
    } catch (err) {
        next(err);
    }
};
