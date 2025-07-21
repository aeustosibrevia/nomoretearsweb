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

exports.createCategory = async (req, res, next) => {
    try{
        const result = await categoryService.createCategory(req.body, req.user);
        res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
};

exports.updateCategory = async (req, res, next) => {
    try{
        const result = await categoryService.updateCategory(req.params.id, req.body, req.user);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try{
        const result = await categoryService.deleteCategory(req.params.id, req.user);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.getAllCategories = async (req, res, next) => {
    try{
        const result = await categoryService.getAllCategories();
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try{
        const result = await categoryService.getCategoryById(req.params.id);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};