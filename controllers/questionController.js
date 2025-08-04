const createError = require('http-errors');
const Question = require('../models/question');

exports.loadQuestion = async (req, res, next) => {
    try {
        const question = await Question.findByPk(req.params.id);
        if (!question) return next(createError(404, 'Питання не знайдено.'));
        req.question = question;
        next();
    } catch (err) {
        next(err);
    }
};

// POST /api/questions
exports.createQuestion = async (req, res, next) => {
    try {
        const result = await require('../services/questionService')
            .createQuestion(req.body, req.user);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

// PUT /api/questions/:id
exports.updateQuestion = async (req, res, next) => {
    try {
        const result = await require('../services/questionService')
            .updateQuestion(req.params.id, req.body, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

// DELETE /api/questions/:id
exports.deleteQuestion = async (req, res, next) => {
    try {
        const result = await require('../services/questionService')
            .deleteQuestion(req.params.id, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getQuestion = async (req, res, next) => {
    try {
        const question = await require('../services/questionService').getQuestionById(req.params.id, req.user);
        res.json(question);
    } catch (err) {
        next(err);
    }
};

exports.getByQuiz = async (req, res, next) => {
    try {
        const questions = await require('../services/questionService').getQuestionsByQuiz(req.params.quizId, req.user);
        res.json(questions);
    } catch (err) {
        next(err);
    }
};

