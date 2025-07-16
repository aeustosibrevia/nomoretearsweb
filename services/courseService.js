const  createError  = require('http-errors');
const Course = require("../models/course");
const Category = require("../models/category");
const User = require("../models/user");

exports.createCourse = async (data, user) => {
    if (!user || user.role !== 'admin') {
        throw createError(403, "Тільки адміністратор може створювати курс.");
    }

    let instructorId = user.userId;

    if (data.instructor_email) {
        const instructor = await User.findOne({
            where: { email: data.instructor_email.trim().toLowerCase() }
        });

        if (!instructor) {
            throw createError(400, "Інструктора з такою email не знайдено.");
        }

        if (instructor.role !== 'instructor' && instructor.role !== 'admin') {
            throw createError(400, "Вказаний користувач не є викладачем.");
        }

        instructorId = instructor.id;
    }

    const newCourse = await Course.create({
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        img_data: data.img_data,
        instructor_id: instructorId,
        category_id: data.category_id
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

    const isAdmin = user.role === 'admin';
    const isOwnerInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!user || (!isAdmin && !isOwnerInstructor)) {
        throw createError(403, "У вас немає прав для цієї дії.");
    }

    if (data.instructor_email !== undefined) {
        if (user.role !== 'admin') {
            throw createError(403, "Тільки адміністратор може змінювати інструктора.");
        }

        const newInstructor = await User.findOne({
            where: { email: data.instructor_email }
        });

        if (!newInstructor) {
            throw createError(400, "Користувача з таким email не знайдено.");
        }

        course.instructor_id = newInstructor.id;
    }

    course.title = data.title ?? course.title;
    course.slug = data.slug ?? course.slug;
    course.description = data.description ?? course.description;
    course.price = data.price ?? course.price;
    course.img_data = data.img_data ?? course.img_data;
    course.instructor_id = data.instructor_id ?? course.instructor_id;
    course.category_id = data.category_id ?? course.category_id;

    await course.save();

    return {
        message: "Курс успішно оновлено",
        courseId: course.id
    };
};

exports.deleteCourse = async (id, user) => {
    if (!user || user.role !== 'admin') {
        throw createError(403, "Тільки адміністратор може видаляти курс.")
    }

    const course = await Course.findByPk(id);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    await course.destroy();

    return{
        message: "Категорію успішно видалено.",
        categoryId : course.id
    };
};

exports.getAllCourses = async() => {
    return await Course.findAll({
        order: [['id', 'ASC']]
    });
};

exports.getCourseById = async(id) => {
    return await Course.findByPk(id);
};

exports.getCoursesByCategory = async(categoryId) => {
    return await Course.findAll({
        where: {category_id: categoryId}
    });
};

exports.getCoursesByInstructor = async(instructorId) => {
    return await Course.findAll({
        where: {instructor_id: instructorId}
    });
};

exports.publishCourse = async (id, user) => {
    const course = await Course.findByPk(id);

    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const isAdmin = user.role === 'admin';
    const isOwnerInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!isAdmin && !isOwnerInstructor) {
        throw createError(403, "У вас немає прав для цієї дії.");
    }

    course.is_published = true;
    await course.save();

    return {
        message: "Курс успішно опубліковано.",
        courseId: course.id
    };
};

exports.unpublishCourse = async (id, user) => {
    const course = await Course.findByPk(id);

    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const isAdmin = user.role === 'admin';
    const isOwnerInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!isAdmin && !isOwnerInstructor) {
        throw createError(403, "У вас немає прав для цієї дії.");
    }

    course.is_published = false;
    await course.save();

    return {
        message: "Курс успішно знято з публікації.",
        courseId: course.id
    };
};


