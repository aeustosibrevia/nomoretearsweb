const createError = require('http-errors');
const Quiz = require('../models/quiz');

exports.validateQuestion = async (req, res, next) => {
    const { quiz_id, question_text, question_type } = req.body;
    const errors = [];
    const question = req.question;

    if (!question) {
        if (!question_text || question_text.trim().length < 5) {
            errors.push('Текст питання має містити щонайменше 5 символів.');
        }
    } else {
        if (question_text !== undefined && question_text.trim().length < 5) {
            errors.push('Текст питання має містити щонайменше 5 символів.');
        }
    }

    const types = ['single_choice', 'multiple_choice'];
    if (!question) {
        if (!types.includes(question_type)) {
            errors.push('Поле question_type має бути single_choice або multiple_choice.');
        }
    } else if (question_type !== undefined && !types.includes(question_type)) {
        errors.push('Поле question_type має бути single_choice або multiple_choice.');
    }

    if (!question) {
        if (quiz_id === undefined || isNaN(quiz_id)) {
            errors.push('Необхідно вказати дійсний quiz_id.');
        }
    } else if (quiz_id !== undefined && isNaN(quiz_id)) {
        errors.push('Поле quiz_id має бути числом.');
    }

    if (errors.length) {
        return res.status(400).json({ errors });
    }

    try {
        if (quiz_id !== undefined && !isNaN(quiz_id)) {
            const quiz = await Quiz.findByPk(quiz_id);
            if (!quiz) {
                return next(createError(400, 'Квіз з таким ID не існує.'));
            }
        }
        next();
    } catch (err) {
        next(err);
    }
};
