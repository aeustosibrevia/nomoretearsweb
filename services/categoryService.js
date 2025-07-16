const Category = require('../models/category');
const  createError  = require('http-errors');

exports.createCategory = async (data, user) => {
    if (!user || user.role !== 'admin') {
        throw createError(403, "Тільки адміністратор може створювати категорії.")
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

exports.updateCategory = async(id, data, user) =>{
    if (!user || user.role !== 'admin') {
        throw createError(403, "Тільки адміністратор може змінювати категорію.")
    }

    const category = await Category.findByPk(id);

    if (!category) {
        throw createError(404, "Категорію не знайдено.");
    }

    category.name = data.name ?? category.name;
    category.slug = data.slug ?? category.slug;

    await category.save();

    return {
        message: "Категорію успішно оновлено.",
        categoryId : category.id
    };
};

exports.deleteCategory = async(id, user) =>{
    if (!user || user.role !== 'admin') {
        throw createError(403, "Тільки адміністратор може видаляти категорію.")
    }

    const category = await Category.findByPk(id);
    if (!category) {
        throw createError(404, "Категорію не знайдено.");
    }

    await category.destroy();

    return{
        message: "Категорію успішно видалено.",
        categoryId : category.id
    };
};

exports.getAllCategories = async() => {
    return await Category.findAll({
        order: [['id', 'ASC']]
    });
};

exports.getCategoryById = async(id) => {
    return await Category.findByPk(id, {
        attributes: ['name', 'slug']
    });
};