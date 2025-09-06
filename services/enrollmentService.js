const createError = require('http-errors');
const Enrollment = require('../models/enrollment');
const Lesson = require('../models/lesson');
const Course = require('../models/course');
const User = require('../models/user');
const LessonProgress = require('../models/lessonProgress');

exports.enroll = async (username, courseId, currentUser) => {
    if (!currentUser || currentUser.role !== 'admin') {
        throw createError(403, 'Тільки адміністратор може виконувати цю дію.');
    }
    if (!username || !courseId) {
        throw createError(400, 'username і courseId обовʼязкові.');
    }

    const user = await User.findOne({
        where: { username },
        attributes: ['id', 'username', 'email'],
    });
    if (!user) throw createError(404, 'Користувача не знайдено.');

    const [enrollment, created] = await Enrollment.findOrCreate({
        where: { user_id: user.id, course_id: courseId },
        defaults: { enrolled_at: new Date(), progress_percent: 0 },
    });

    if (!created) {
        throw createError(409, 'Користувач вже записаний на курс.');
    }

    return { message: 'Успішна реєстрація на курс.', user, courseId: Number(courseId) };
};

exports.unenroll = async (username, courseId, currentUser) => {
    if (!currentUser || currentUser.role !== 'admin') {
        throw createError(403, 'Тільки адміністратор може виконувати цю дію.');
    }
    if (!username || !courseId) {
        throw createError(400, 'username і courseId обовʼязкові.');
    }

    const user = await User.findOne({
        where: { username },
        attributes: ['id', 'username', 'email'],
    });
    if (!user) throw createError(404, 'Користувача не знайдено.');

    const enrollment = await Enrollment.findOne({
        where: { user_id: user.id, course_id: courseId },
    });
    if (!enrollment) throw createError(404, 'Запис не знайдено.');

    await enrollment.destroy();
    return { message: 'Користувача відписано від курсу.', user, courseId: Number(courseId) };
};

exports.getUserProgress = async (userId, courseId) => {
    const enrollment = await Enrollment.findOne({
        where: { user_id: userId, course_id: courseId },
    });
    if (!enrollment) throw createError(404, 'Користувач не записаний на курс.');
    return { progress: enrollment.progress_percent };
};

exports.updateProgress = async (userId, course_id) => {
    const totalLessons = await Lesson.count({ where: { course_id } });
    if (totalLessons === 0) return;

    const finishedLessons = await LessonProgress.count({
        where: { user_id: userId, is_finished: true },
        include: [{ model: Lesson, where: { course_id: course_id } }],
    });

    const percent = Math.round((finishedLessons / totalLessons) * 100);

    await Enrollment.update({ progress_percent: percent }, {
        where: { user_id: userId, course_id: course_id },
    });
};

exports.isUserEnrolled = async (userId, courseId) => {
    const enrollment = await Enrollment.findOne({
        where: { user_id: userId, course_id: courseId }
    });

    return !!enrollment;
};

exports.listByUserId = async (userId) => {
    return Enrollment.findAll({
        where: { user_id: userId },
        include: [{ model: Course, as: 'course', attributes: ['id', 'title', 'slug'] }],
        order: [['enrolled_at', 'DESC']]
    });
};

exports.listByUsernameForAdmin = async (username, currentUser) => {
    if (!currentUser || currentUser.role !== 'admin') {
        throw createError(403, 'Тільки адміністратор може переглядати цей список.');
    }
    if (!username) throw createError(400, 'username is required');

    const user = await User.findOne({
        where: { username },
        attributes: ['id', 'username', 'email'],
    });

    if (!user) return { user: null, enrollments: [] };

    const enrollments = await exports.listByUserId(user.id);
    return { user, enrollments };
};

exports.enrollmentByUser = async (userId, currentUser) => {
    if (!currentUser || currentUser.role !== 'admin') {
        throw createError(403, 'Тільки адміністратор може переглядати цей список.');
    }
    if (!userId) throw createError(400, 'userId is required');

    const user = await User.findByPk(userId, {
        attributes: ['id', 'username', 'email'],
    });

    if (!user) return { user: null, enrollments: [] };

    const enrollments = await exports.listByUserId(user.id);
    return { user, enrollments };
};
