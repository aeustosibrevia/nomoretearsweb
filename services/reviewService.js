const createError = require('http-errors');
const Review = require('../models/review');
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');

exports.createReview = async (data, user) => {
    const course = await Course.findByPk(data.course_id);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const isEnrolled = await Enrollment.findOne({
        where: {
            user_id: user.userId,
            course_id: data.course_id
        }
    });

    if (!isEnrolled) {
        throw createError(403, "Ви не записані на цей курс.");
    }

    const existingReview = await Review.findOne({
        where: {
            user_id: user.userId,
            course_id: data.course_id
        }
    });

    if (existingReview) {
        throw createError(409, "Ви вже залишали відгук до цього курсу.");
    }

    const newReview = await Review.create({
        user_id: user.userId,
        course_id: data.course_id,
        rating: data.rating,
        comment: data.comment
    });

    return {
        message: "Відгук успішно створено.",
        reviewId: newReview.id
    };
};

exports.updateReview = async (id, data, user) => {
    const review = await Review.findByPk(id);
    if (!review) {
        throw createError(404, "Відгук не знайдено.");
    }

    const isAdmin = user.role === 'admin';
    const isOwner = review.user_id === user.userId;

    if (!isAdmin && !isOwner) {
        throw createError(403, "Ви не маєте прав для редагування цього відгуку.");
    }

    if (data.rating !== undefined) {
        review.rating = data.rating;
    }

    if (data.comment !== undefined) {
        review.comment = data.comment;
    }

    await review.save();

    return {
        message: "Відгук успішно оновлено.",
        reviewId: review.id
    };
};

exports.deleteReview = async (id, user) => {
    const review = await Review.findByPk(id);
    if (!review) {
        throw createError(404, "Відгук не знайдено.");
    }

    const isAdmin = user.role === 'admin';
    const isOwner = review.user_id === user.userId;

    if (!isAdmin && !isOwner) {
        throw createError(403, "Ви не маєте прав для видалення цього відгуку.");
    }

    await review.destroy();

    return {
        message: "Відгук успішно видалено.",
        reviewId: review.id
    };
};

exports.getReviewsByCourse = async (courseId) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const reviews = await Review.findAll({
        where: { course_id: courseId },
        order: [['created_at', 'DESC']]
    });

    return reviews;
};

exports.getAverageRating = async (courseId) => {
    const course = await Course.findByPk(courseId);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const result = await Review.findOne({
        where: { course_id: courseId },
        attributes: [
            [Review.sequelize.fn('AVG', Review.sequelize.col('rating')), 'average'],
            [Review.sequelize.fn('COUNT', Review.sequelize.col('id')), 'count']
        ],
        raw: true
    });

    return {
        average: result.average ? parseFloat(result.average).toFixed(2) : null,
        count: parseInt(result.count)
    };
};
