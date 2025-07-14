const categoryService = require("../services/categoryService");

exports.createCategory = async (req, res, next) => {
    try{
        console.log('BODY:', req.body); // <-- Обязательно
        const result = await categoryService.createCategory(req.body);
        res.status(201).json(result);
    }
    catch(err){
        next(err);
    }
};

exports.updateCategory = async (req, res, next) => {
    try{
        const result = await categoryService.updateCategory(req.params.id, req.body);
        res.json(result);
    }
    catch(err){
        next(err);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try{
        const result = await categoryService.deleteCategory(req.params.id);
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