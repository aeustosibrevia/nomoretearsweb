const createError = require('http-errors');
const answerService = require('../services/answerService');
const Answer = require('../models/answer');
const Question = require('../models/question');
const Quiz = require('../models/quiz');
const Lesson = require('../models/lesson');
const Course = require('../models/course');

exports.loadAnswer = async (req, _res, next) => {
    try {
        const { id } = req.params;
        const answer = await Answer.findByPk(id, {
            include: { model: Question, as: 'question', include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', include: { model: Course, as: 'course', attributes: ['instructor_id'] } } } }
        });
        if (!answer) return next(createError(404, 'Відповідь не знайдено.'));
        req.answer = answer;
        next();
    } catch (e) { next(e); }
};

exports.createAnswer = async (req, res, next) => {
    try {
        const { question_id, answer_text, is_correct } = req.body || {};
        const result = await answerService.createAnswer({ questionId: question_id, data: { answer_text, is_correct }, user: req.user });
        res.status(201).json(result);
    } catch (err) { next(err); }
};

exports.getAnswersByQuestion = async (req, res, next) => {
    try {
        const { question_id } = req.query;
        if (!question_id) throw createError(400, 'Потрібен параметр question_id.');
        const result = await answerService.getAnswersByQuestion({ questionId: question_id, user: null, visibility: 'public' });
        res.json(result);
    } catch (err) { next(err); }
};

exports.getAnswersByQuestionWithCorrect = async (req, res, next) => {
    try {
        const { question_id } = req.query;
        if (!question_id) throw createError(400, 'Потрібен параметр question_id.');
        const result = await answerService.getAnswersByQuestion({ questionId: question_id, user: req.user, visibility: 'author' });
        res.json(result);
    } catch (err) { next(err); }
};

exports.getAnswerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await answerService.getAnswerById({ id, user: null, visibility: 'public' });
        res.json(result);
    } catch (err) { next(err); }
};

exports.updateAnswer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await answerService.updateAnswer({ id, data: req.body, user: req.user });
        res.json(result);
    } catch (err) { next(err); }
};

exports.deleteAnswer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await answerService.deleteAnswer({ id, user: req.user });
        res.json(result);
    } catch (err) { next(err); }
};

exports.replaceAnswersForQuestion = async (req, res, next) => {
    try {
        const { question_id } = req.query;
        if (!question_id) throw createError(400, 'Потрібен параметр question_id.');
        const result = await answerService.replaceAnswersForQuestion({ questionId: question_id, answers: req.body.answers, user: req.user });
        res.json(result);
    } catch (err) { next(err); }
};

