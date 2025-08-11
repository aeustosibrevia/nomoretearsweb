const createErrorMV = require('http-errors');

exports.validateAnswer = (req, _res, next) => {
    const { answer_text, is_correct } = req.body || {};
    const errors = [];

    if (typeof answer_text !== 'string' || !answer_text.trim()) {
        errors.push('Поле answer_text обов\'язкове та має бути рядком.');
    }
    if (typeof is_correct !== 'undefined' && typeof is_correct !== 'boolean') {
        errors.push('Поле is_correct має бути булевим.');
    }

    if (errors.length) return next(createErrorMV(400, errors.join(' ')));
    next();
};

exports.validateAnswersReplace = (req, _res, next) => {
    const { answers } = req.body || {};
    if (!Array.isArray(answers)) return next(createErrorMV(400, 'Потрібен масив answers.'));
    if (answers.length < 1) return next(createErrorMV(400, 'Масив answers не може бути порожнім.'));

    for (const [i, a] of answers.entries()) {
        if (typeof a.answer_text !== 'string' || !a.answer_text.trim()) {
            return next(createErrorMV(400, `answers[${i}].answer_text обов'язкове.`));
        }
        if (typeof a.is_correct === 'undefined') {
            return next(createErrorMV(400, `answers[${i}].is_correct обов'язкове (true/false).`));
        }
        if (typeof a.is_correct !== 'boolean') {
            return next(createErrorMV(400, `answers[${i}].is_correct має бути булевим.`));
        }
    }
    next();
};