const courseService = require("../services/courseService");
const createError = require("http-errors");
const Course = require("../models/course");

exports.loadCourse = async (req, res, next) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return next(createError(404, "Курс не знайдено."));
        }
        req.course = course;
        next();
    } catch (err) {
        next(err);
    }
};

// POST /api/courses
exports.createCourse = async (req, res, next) => {
    try {
        const result = await courseService.createCourse(req.body, req.user);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// PUT /api/courses/:id
exports.updateCourse = async (req, res, next) => {
    try {
        const result = await courseService.updateCourse(req.params.id, req.body, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
    try {
        const result = await courseService.deleteCourse(req.params.id, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// PUT /api/courses/:id/publish
exports.publishCourse = async (req, res, next) => {
    try {
        const result = await courseService.publishCourse(req.params.id, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// PUT /api/courses/:id/unpublish
exports.unpublishCourse = async (req, res, next) => {
    try {
        const result = await courseService.unpublishCourse(req.params.id, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/courses
exports.getAllCourses = async (req, res, next) => {
    try {
        const result = await courseService.getAllCourses();
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/courses/:id
exports.getCourseById = async (req, res, next) => {
    try {
        const result = await courseService.getCourseById(req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /courses/:categorySlug/:courseSlug
exports.getCourseBySlugs = async (req, res, next) => {
    try {
        const { categorySlug, courseSlug } = req.params;
        const result = await courseService.getBySlugs(categorySlug, courseSlug);
        if (!result) {
            return next(createError(404, "Курс не знайдено."));
        }
        res.json(result);
    } catch (err) {
        next(err);
    }
};
