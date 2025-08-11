const createError = require('http-errors');
const enrollmentService = require('../services/enrollmentService');
const Course = require('../models/course');
const Lesson = require('../models/lesson');
const Quiz = require('../models/quiz');
const Question = require('../models/question');
const Answer = require('../models/answer');

async function resolveCourseId(req) {
    const q = { ...req.params, ...req.query, ...req.body };

    if (q.course_id || q.courseId) return { courseId: Number(q.course_id || q.courseId) };

    if (q.lesson_id || q.lessonId) {
        const lesson = await Lesson.findByPk(q.lesson_id || q.lessonId, { attributes: ['course_id'] });
        if (!lesson) throw createError(404, 'Урок не знайдено.');
        return { courseId: lesson.course_id };
    }

    if (q.quiz_id || q.quizId) {
        const quiz = await Quiz.findByPk(q.quiz_id || q.quizId, {
            include: { model: Lesson, as: 'lesson', attributes: ['course_id'] }
        });
        if (!quiz) throw createError(404, 'Квіз не знайдено.');
        return { courseId: quiz.lesson.course_id };
    }

    if (q.question_id || q.questionId) {
        const question = await Question.findByPk(q.question_id || q.questionId, {
            include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', attributes: ['course_id'] } }
        });
        if (!question) throw createError(404, 'Питання не знайдено.');
        return { courseId: question.quiz.lesson.course_id };
    }

    if (q.answer_id || q.answerId) {
        const answer = await Answer.findByPk(q.answer_id || q.answerId, {
            include: { model: Question, as: 'question', include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', attributes: ['course_id'] } } }
        });
        if (!answer) throw createError(404, 'Відповідь не знайдено.');
        return { courseId: answer.question.quiz.lesson.course_id };
    }

    if (q.lessonSlug) {
        const lesson = await Lesson.findOne({
            where: { slug: q.lessonSlug },
            attributes: ['course_id']
        });
        if (!lesson) throw createError(404, 'Урок не знайдено.');
        return { courseId: lesson.course_id };
    }

    if (q.id) {
        const tryAnswer = await Answer.findByPk(q.id, {
            include: { model: Question, as: 'question', include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', attributes: ['course_id'] } } }
        });
        if (tryAnswer) return { courseId: tryAnswer.question.quiz.lesson.course_id };

        const tryQuestion = await Question.findByPk(q.id, {
            include: { model: Quiz, as: 'quiz', include: { model: Lesson, as: 'lesson', attributes: ['course_id'] } }
        });
        if (tryQuestion) return { courseId: tryQuestion.quiz.lesson.course_id };

        const tryQuiz = await Quiz.findByPk(q.id, { include: { model: Lesson, as: 'lesson', attributes: ['course_id'] } });
        if (tryQuiz) return { courseId: tryQuiz.lesson.course_id };

        const tryLesson = await Lesson.findByPk(q.id, { attributes: ['course_id'] });
        if (tryLesson) return { courseId: tryLesson.course_id };
    }

    throw createError(400, 'Не вдалося визначити course_id для перевірки доступу.');
}


function requireActiveEnrollmentByResource() {
    return async (req, _res, next) => {
        try {
            if (!req.user) return next(createError(401, 'Потрібна авторизація.'));

            const resolved = await resolveCourseId(req);
            const courseId = resolved.courseId;

            const course = await Course.findByPk(courseId, { attributes: ['id', 'instructor_id'] });
            if (!course) return next(createError(404, 'Курс не знайдено.'));

            if (req.user.role === 'admin' || req.user.userId === course.instructor_id) {
                return next();
            }

            const ok = await enrollmentService.isUserEnrolled(req.user.userId, courseId);
            if (!ok) return next(createError(403, 'Доступ заборонено. Потрібно придбати курс.'));

            next();
        } catch (err) {
            next(err);
        }
    };
}

module.exports = { requireActiveEnrollmentByResource, resolveCourseId };