const createError = require('http-errors');
const Lesson = require('../models/lesson');
const Course = require('../models/course');
const Quiz = require('../models/quiz');
const enrollmentService = require('./enrollmentService');

//const { Quiz, Lesson, Course, Question, Answer, UserAnswer } = require('../models');
const generateSlug = require('../utils/slug');

function checkAccess(user, courseInstructorId) {
    if (user.role !== 'admin' && user.userId !== courseInstructorId) {
        throw createError(403, 'Доступ заборонено.');
    }
}

exports.createQuiz = async (data, user) => {
    console.log(Lesson);
    const lesson = await Lesson.findByPk(data.lesson_id, {
        include: {
            model: Course,
            as: 'course',
            attributes: ['instructor_id']
        }
    });

    if (!lesson) {
        throw createError(404, 'Урок не знайдено.');
    }

    checkAccess(user, lesson.course.instructor_id);

    const newQuiz = await Quiz.create({
        title: data.title,
        slug: generateSlug(data.title),
        lesson_id: data.lesson_id
    });

    return {
        message: 'Квіз успішно створено.',
        quizId: newQuiz.id
    };
};

exports.updateQuiz = async (id, data, user) => {
    const quiz = await Quiz.findByPk(id, {
        include: {
            model: Lesson,
            include: {
                model: Course,
                as: 'course',
                attributes: ['instructor_id']
            }
        }
    });

    if (!quiz) {
        throw createError(404, 'Квіз не знайдено.');
    }

    checkAccess(user, quiz.lesson.course.instructor_id);

    if (data.title) {
        quiz.title = data.title;
        quiz.slug = generateSlug(data.title);
    }

    await quiz.save();

    return {
        message: 'Квіз успішно оновлено.',
        quizId: quiz.id
    };
};


exports.deleteQuiz = async (quizId, user) => {
    const quiz = await Quiz.findByPk(quizId, {
        include: {
            model: Lesson,
            include: { model: Course, attributes: ['instructor_id'] }
        }
    });

    if (!quiz) {
        throw createError(404, 'Квіз не знайдено.');
    }

    checkAccess(user, quiz.lesson.course.instructor_id);

    await quiz.destroy();
    return { message: 'Квіз видалено.' };
};

exports.getQuizById = async (quizId, user) => {
    const quiz = await Quiz.findByPk(quizId, {
        include: {
            model: Lesson,
            include: {
                model: Course,
                as: 'course',
                attributes: ['instructor_id']
            }
        }
    });

    if (!quiz) {
        throw createError(404, 'Квіз не знайдено.');
    }

    checkAccess(user, quiz.lesson.course.instructor_id);

    return quiz;
};


exports.getQuizzesByLesson = async (lessonId, user) => {
    const lesson = await Lesson.findByPk(lessonId, {
        include: {
            model: Course,
            as: 'course',
            attributes: ['id', 'instructor_id']
        }
    });

    if (!lesson) {
        throw createError(404, 'Урок не знайдено.');
    }

    const course = lesson.course;
    const isAdmin = user.role === 'admin';
    const isInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!isAdmin && !isInstructor) {
        const isEnrolled = await enrollmentService.isUserEnrolled(user.userId, course.id);
        if (!isEnrolled) {
            throw createError(403, 'Ви не маєте доступу до цього уроку.');
        }
    }

    return await Quiz.findAll({ where: { lesson_id: lessonId } });
};


// exports.getQuizResult = async (userId, quizId) => {
//     const questions = await Question.findAll({
//         where: { quiz_id: quizId },
//         include: [
//             {
//                 model: Answer,
//                 where: { is_correct: true },
//                 attributes: ['id']
//             }
//         ]
//     });
//
//     let correctCount = 0;
//
//     for (const question of questions) {
//         const correctAnswerIds = question.answers.map(a => a.id);
//
//         const userAnswers = await UserAnswer.findAll({
//             where: {
//                 user_id: userId,
//                 question_id: question.id
//             }
//         });
//
//         const userAnswerIds = userAnswers.map(ua => ua.answer_id);
//
//         const isCorrect =
//             userAnswerIds.length === correctAnswerIds.length &&
//             userAnswerIds.every(id => correctAnswerIds.includes(id));
//
//         if (isCorrect) {
//             correctCount++;
//         }
//     }
//
//     return {
//         totalQuestions: questions.length,
//         correctAnswers: correctCount
//     };
// };
