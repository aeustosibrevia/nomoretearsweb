const createError = require('http-errors');
const Question = require ('../models/question');
const Course = require ('../models/course');
const Lesson = require ('../models/lesson');
const Quiz = require ('../models/quiz');
const enrollmentService = require('./enrollmentService');

function checkAccess(user, instructorId) {
    if (user.role !== 'admin' && user.userId !== instructorId) {
        throw createError(403, 'Немає прав доступу.');
    }
}

exports.createQuestion = async (data, user) => {
    const quiz = await Quiz.findByPk(data.quiz_id, {
        include: {
            model: Lesson,
            as: 'lesson',
            include: {
                model: Course,
                as: 'course',
                attributes: ['instructor_id']
            }
        }
    });

    if (!quiz) throw createError(404, 'Квіз не знайдено.');
    const instructorId = quiz.lesson.course.instructor_id;
    checkAccess(user, instructorId);

    const newQuestion = await Question.create({
        quiz_id: data.quiz_id,
        question_text: data.question_text,
        question_type: data.question_type
    });

    return {
        message: 'Питання успішно створено.',
        questionId: newQuestion.id
    };
};

exports.updateQuestion = async (id, data, user) => {
    const question = await Question.findByPk(id);
    if (!question) throw createError(404, 'Питання не знайдено.');

    const quiz = await Quiz.findByPk(question.quiz_id, {
        include: {
            model: Lesson,
            as: 'lesson',
            include: {
                model: Course,
                as: 'course',
                attributes: ['instructor_id']
            }
        }
    });

    if (!quiz) throw createError(404, 'Квіз не знайдено.');
    const instructorId = quiz.lesson.course.instructor_id;
    checkAccess(user, instructorId);

    if (data.question_text !== undefined) {
        question.question_text = data.question_text;
    }
    if (data.question_type !== undefined) {
        question.question_type = data.question_type;
    }

    await question.save();

    return {
        message: 'Питання оновлено.',
        questionId: question.id
    };
};

exports.deleteQuestion = async (id, user) => {
    const question = await Question.findByPk(id);
    if (!question) throw createError(404, 'Питання не знайдено.');

    const quiz = await Quiz.findByPk(question.quiz_id, {
        include: {
            model: Lesson,
            as: 'lesson',
            include: {
                model: Course,
                as: 'course',
                attributes: ['instructor_id']
            }
        }
    });

    if (!quiz) throw createError(404, 'Квіз не знайдено.');
    const instructorId = quiz.lesson.course.instructor_id;
    checkAccess(user, instructorId);

    await question.destroy();

    return {
        message: 'Питання видалено.',
        questionId: id
    };
};

exports.getQuestionById = async (id, user) => {
    const question = await Question.findByPk(id, {
        include: [
            {
                model: Quiz,
                as: 'quiz',
                include: {
                    model: Lesson,
                    as: 'lesson',
                    include: {
                        model: Course,
                        as: 'course',
                        attributes: ['instructor_id']
                    }
                }
            }
        ]
    });

    if (!question) throw createError(404, 'Питання не знайдено.');

    const instructorId = question.quiz.lesson.course.instructor_id;
    checkAccess(user, instructorId);

    return question;
};

exports.getQuestionsByQuiz = async (quizId, user) => {
    const quiz = await Quiz.findByPk(quizId, {
        include: {
            model: Lesson,
            as: 'lesson',
            include: {
                model: Course,
                as: 'course',
                attributes: ['id']
            }
        }
    });

    if (!quiz) throw createError(404, 'Квіз не знайдено.');

    const course = quiz.lesson.course;
    const isAdmin = user.role === 'admin';
    const isInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!isAdmin && !isInstructor) {
        const isEnrolled = await enrollmentService.isUserEnrolled(user.userId, course.id);
        if (!isEnrolled) {
            throw createError(403, 'Ви не маєте доступу до цього уроку.');
        }
    }

    const questions = await Question.findAll({
        where: { quiz_id: quizId }
    });

    return questions;
};
