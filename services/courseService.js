const Course = require('../models/course');
const Category = require('../models/category');
const createError = require('http-errors');
const generateSlug = require('../utils/slug');

exports.createCourse = async (data, user) => {
    if (!user || (user.role !== 'admin' && user.role !== 'instructor')) {
        throw createError(403, "Лише адміністратор або інструктор може створювати курси.");
    }

    const category = await Category.findByPk(data.category_id);
    if (!category) {
        throw createError(404, "Категорію не знайдено.");
    }

    const newCourse = await Course.create({
        title: data.title,
        slug: generateSlug(data.title),
        description: data.description,
        price: data.price,
        img_data: data.img_data,
        instructor_id: user.userId,
        category_id: data.category_id,
        is_published: false
    });

    return {
        message: "Курс успішно створено.",
        courseId: newCourse.id
    };
};

exports.updateCourse = async (id, data, user) => {
    const course = await Course.findByPk(id);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const isOwner = course.instructor_id === user.userId;
    if (user.role !== 'admin' && !isOwner) {
        throw createError(403, "Недостатньо прав для оновлення курсу.");
    }

    if (data.title) {
        course.title = data.title;
        course.slug = generateSlug(data.title);
    }

    course.description = data.description ?? course.description;
    course.price = data.price ?? course.price;
    course.img_data = data.img_data ?? course.img_data;
    course.category_id = data.category_id ?? course.category_id;

    await course.save();

    return {
        message: "Курс успішно оновлено.",
        courseId: course.id
    };
};

exports.deleteCourse = async (id, user) => {
    const course = await Course.findByPk(id);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const isOwner = course.instructor_id === user.userId;
    if (user.role !== 'admin' && !isOwner) {
        throw createError(403, "Недостатньо прав для видалення курсу.");
    }

    await course.destroy();

    return {
        message: "Курс успішно видалено.",
        courseId: course.id
    };
};

exports.publishCourse = async (id, user) => {
    const course = await Course.findByPk(id);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    if (user.role !== 'admin' && course.instructor_id !== user.userId) {
        throw createError(403, "Недостатньо прав для публікації курсу.");
    }

    course.is_published = true;
    await course.save();

    return { message: "Курс опубліковано." };
};

exports.unpublishCourse = async (id, user) => {
    const course = await Course.findByPk(id);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    if (user.role !== 'admin' && course.instructor_id !== user.userId) {
        throw createError(403, "Недостатньо прав для зняття курсу з публікації.");
    }

    course.is_published = false;
    await course.save();

    return { message: "Курс знято з публікації." };
};

exports.getBySlugs = async (categorySlug, courseSlug, user) => {
    const course = await Course.findOne({
        where: { slug: courseSlug },
        include: [
            {
                association: 'category',
                where: { slug: categorySlug }
            },
            'lessons'
        ]
    });

    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    if (!course.is_published) {
        const isOwner = user?.userId === course.instructor_id;
        const isAdmin = user?.role === 'admin';
        if (!isOwner && !isAdmin) {
            throw createError(403, "Курс ще не опублікований.");
        }
    }

    return course;
};

