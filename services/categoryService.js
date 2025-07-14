const Category = require('../models/category');
const  createError  = require('http-errors');

exports.createCategory = async (data) => {
    const existingCategoryByName = await Category.findOne({
        where: {name: data.name},
    });
    if (existingCategoryByName) {
        throw createError(409, "Категорія з таким ім'ям вже існує.");
    }

    const existingCategoryBySlug = await Category.findOne({
        where: {slug: data.slug},
    });
    if (existingCategoryBySlug) {
        throw createError(409, "Катеорія з таким slug вже існує")
    }

    const newCategory = await Category.create({
        name: data.name,
        slug: data.slug

    });

    return {
        message: 'Нову категорію успішно створено',
        categoryId: newCategory.id
    };
};
