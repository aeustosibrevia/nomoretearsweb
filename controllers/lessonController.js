const lessonService = require('../services/lessonService');
const createError = require('http-errors');
const Lesson = require('../models/lesson');

exports.loadLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findByPk(req.params.id);
        if (!lesson) {
            return next(createError(404, "Урок не знайдено."));
        }
        req.lesson = lesson;
        next();
    } catch (err) {
        next(err);
    }
};


exports.createLesson = async (req, res, next) => {
    try{
        const result = await lessonService.createLesson(req.body, req.user);
        res.status(201).json(result);
    }
    catch (err) {
        next(err);
    }
};

exports.updateLesson = async (req, res, next) => {
    try{
        const result = await lessonService.updateLesson(req.params.id, req.body, req.user);
        res.status(200).json(result);
    }
    catch (err) {
        next(err);
    }
};


exports.deleteLesson = async (req, res, next) => {
    try{
        const result = await lessonService.deleteLesson(req.params.id, req.user);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

exports.getLessonById = async (req, res, next) => {
    try{
        const result = await lessonService.getLessonById(req.params.id, req.user);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

exports.getLessonsByCourse = async (req, res, next) => {
    try{
        const result = await lessonService.getLessonsByCourse(req.params.id, req.user);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

exports.markLessonAsFinished = async (req, res, next) => {
    try{
        const result = await lessonService.markLessonAsFinished(req.user.userId, req.params.id);
        res.json(result);
    }
    catch (err) {
        next(err);
    }
};

exports.unmarkLessonAsFinished = async (req, res, next) => {
    try {
        const result = await lessonService.unmarkLessonAsFinished(req.user.userId, req.params.id);
        res.json(result);
    } catch (err) {
        next(err);
    }
};


