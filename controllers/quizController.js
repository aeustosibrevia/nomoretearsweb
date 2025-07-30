const quizService = require('../services/quizService');
const createError = require('http-errors');
const Quiz = require('../models/quiz');

exports.loadQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findByPk(req.params.id);
        if (!quiz) {
            return next(createError(404, 'Квіз не знайдено.'));
        }
        req.quiz = quiz;
        next();
    } catch (err) {
        next(err);
    }
};

// POST /api/quizzes
exports.createQuiz = async (req, res, next) => {
    try {
        const result = await quizService.createQuiz(req.body, req.user);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// PUT /api/quizzes/:id
exports.updateQuiz = async (req, res, next) => {
    try {
        const result = await quizService.updateQuiz(req.params.id, req.body, req.user);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/quizzes/:id
exports.deleteQuiz = async (req, res, next) => {
    try {
        const result = await quizService.deleteQuiz(req.params.id, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/quizzes/:id
exports.getQuizById = async (req, res, next) => {
    try {
        const quiz = await quizService.getQuizById(req.params.id, req.user);
        if (!quiz) {
            return next(createError(404, 'Квіз не знайдено.'));
        }
        res.json(quiz);
    } catch (err) {
        next(err);
    }
};

// GET /api/quizzes/by-lesson/:lessonId
exports.getQuizzesByLesson = async (req, res, next) => {
    try {
        const result = await quizService.getQuizzesByLesson(req.params.lessonId, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// GET /api/quizzes/:id/result
exports.getQuizResult = async (req, res, next) => {
    try {
        const result = await quizService.getQuizResult(req.user.userId, req.params.id);

        res.json({
            quizId: req.params.id,
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers
        });
    } catch (err) {
        next(err);
    }
};

