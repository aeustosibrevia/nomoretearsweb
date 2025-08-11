const createError = require('http-errors');
const { Op } = require('sequelize');
const sequelize = require('../models/index');
const Answer = require('../models/answer');
const Question = require('../models/question');
const Quiz = require('../models/quiz');
const Lesson = require('../models/lesson');
const Course = require('../models/course');

function checkAccess(user, courseInstructorId) {
    if (!user || (user.role !== 'admin' && user.userId !== courseInstructorId)) {
        throw createError(403, 'Доступ заборонено.');
    }
}

async function getQuestionWithCourse(questionId) {
    const question = await Question.findByPk(questionId, {
        include: {
            model: Quiz, as: 'quiz', attributes: ['id'],
            include: {
                model: Lesson, as: 'lesson', attributes: ['id', 'course_id'],
                include: { model: Course, as: 'course', attributes: ['id', 'instructor_id'] }
            }
        }
    });
    if (!question) throw createError(404, 'Питання не знайдено.');
    return question;
}

function sanitizeAnswerForVisibility(answerInstance, canSeeCorrect) {
    const a = answerInstance.toJSON();
    if (!canSeeCorrect) delete a.is_correct;
    return a;
}

function canSeeCorrectField(user, visibility) {
    return visibility === 'author' && user && (user.role === 'admin' || user.isInstructor === true);
}

async function enforceInvariantsOnToggle(question, updatedAnswer) {
    if (question.question_type === 'single_choice' && updatedAnswer.is_correct === true) {
        await Answer.update({ is_correct: false }, {
            where: { question_id: question.id, id: { [Op.ne]: updatedAnswer.id } }
        });
    }
}

async function validateSetForQuestion(question, answers) {
    const correctCount = answers.filter(a => a.is_correct === true).length;
    if (question.question_type === 'single_choice') {
        if (correctCount !== 1) throw createError(400, 'Для single_choice повинен бути рівно один правильний варіант.');
    } else if (question.question_type === 'multiple_choice') {
        if (correctCount < 1) throw createError(400, 'Для multiple_choice має бути хоча б один правильний варіант.');
    }
}

exports.createAnswer = async ({ questionId, data, user }) => {
    const question = await getQuestionWithCourse(questionId);
    checkAccess(user, question.quiz.lesson.course.instructor_id);

    const payload = {
        question_id: question.id,
        answer_text: data.answer_text?.trim(),
        is_correct: Boolean(data.is_correct)
    };
    if (!payload.answer_text) throw createError(400, 'Поле answer_text обов\'язкове.');

    const created = await Answer.create(payload);
    await enforceInvariantsOnToggle(question, created);
    return { message: 'Відповідь створено.', answer: sanitizeAnswerForVisibility(created, true) };
};

exports.getAnswersByQuestion = async ({ questionId, user, visibility }) => {
    const question = await getQuestionWithCourse(questionId);
    const canSee = canSeeCorrectField(user, visibility);

    const answers = await Answer.findAll({ where: { question_id: question.id }, order: [['id', 'ASC']] });
    return {
        question_id: question.id,
        answers: answers.map(a => sanitizeAnswerForVisibility(a, canSee))
    };
};

exports.getAnswerById = async ({ id, user, visibility }) => {
    const answer = await Answer.findByPk(id, {
        include: { model: Question, as: 'question', include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', include: { model: Course, as: 'course', attributes: ['instructor_id'] } } } }
    });
    if (!answer) throw createError(404, 'Відповідь не знайдено.');

    const canSee = canSeeCorrectField(user, visibility);
    return sanitizeAnswerForVisibility(answer, canSee);
};

exports.updateAnswer = async ({ id, data, user }) => {
    const answer = await Answer.findByPk(id, {
        include: { model: Question, as: 'question', include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', include: { model: Course, as: 'course', attributes: ['instructor_id'] } } } }
    });
    if (!answer) throw createError(404, 'Відповідь не знайдено.');

    checkAccess(user, answer.question.quiz.lesson.course.instructor_id);

    const updates = {};
    if (typeof data.answer_text === 'string') {
        const t = data.answer_text.trim();
        if (!t) throw createError(400, 'Поле answer_text не може бути порожнім.');
        updates.answer_text = t;
    }
    if (typeof data.is_correct !== 'undefined') {
        updates.is_correct = Boolean(data.is_correct);
    }

    await answer.update(updates);
    await enforceInvariantsOnToggle(answer.question, answer);

    return { message: 'Відповідь оновлено.', answer };
};

exports.deleteAnswer = async ({ id, user }) => {
    const answer = await Answer.findByPk(id, {
        include: { model: Question, as: 'question', include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', include: { model: Course, as: 'course', attributes: ['instructor_id'] } } } }
    });
    if (!answer) throw createError(404, 'Відповідь не знайдено.');

    checkAccess(user, answer.question.quiz.lesson.course.instructor_id);
    await answer.destroy();
    return { message: 'Відповідь видалено.' };
};

exports.replaceAnswersForQuestion = async ({ questionId, answers, user }) => {
    const question = await getQuestionWithCourse(questionId);
    checkAccess(user, question.quiz.lesson.course.instructor_id);

    if (!Array.isArray(answers) || answers.length === 0) throw createError(400, 'Масив answers обов\'язковий.');
    const cleaned = answers.map((a) => ({
        question_id: question.id,
        answer_text: String(a.answer_text || '').trim(),
        is_correct: Boolean(a.is_correct)
    }));
    if (cleaned.some(a => !a.answer_text)) throw createError(400, 'Кожна відповідь повинна мати answer_text.');

    await validateSetForQuestion(question, cleaned);

    return await sequelize.transaction(async (t) => {
        await Answer.destroy({ where: { question_id: question.id }, transaction: t });
        const created = await Answer.bulkCreate(cleaned, { transaction: t, returning: true });
        return { message: 'Набір відповідей замінено.', answers: created };
    });
};