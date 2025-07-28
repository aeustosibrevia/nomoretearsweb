const reviewService = require('../services/reviewService');
const createError = require('http-errors');
const Review = require('../models/review');

exports.loadReview = async (req, res, next) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (!review) {
            return next(createError(404, "Відгук не знайдено."));
        }
        req.review = review;
        next();
    } catch (err) {
        next(err);
    }
};
// POST /api/reviews
exports.createReview = async (req, res, next) => {
    try {
        const result = await reviewService.createReview(req.body, req.user);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// PUT /api/reviews/:id
exports.updateReview = async (req, res, next) => {
    try {
        const result = await reviewService.updateReview(req.params.id, req.body, req.user);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/reviews/:id
exports.deleteReview = async (req, res, next) => {
    try {
        const result = await reviewService.deleteReview(req.params.id, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/reviews?course_id=3
exports.getReviewsByCourse = async (req, res, next) => {
    try {
        const courseId = req.query.course_id;
        if (!courseId) {
            return next(createError(400, "Не передан параметр course_id"));
        }

        const result = await reviewService.getReviewsByCourse(courseId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/reviews/average?course_id=3
exports.getAverageRating = async (req, res, next) => {
    try {
        const courseId = req.query.course_id;
        if (!courseId) {
            return next(createError(400, "Не передан параметр course_id"));
        }

        const result = await reviewService.getAverageRating(courseId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
