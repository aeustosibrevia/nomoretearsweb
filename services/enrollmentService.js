const createError = require('http-errors');
const Enrollment = require('../models/enrollment');
const Lesson = require('../models/lesson');
const LessonProgress = require('../models/lessonProgress');

exports.enroll = async (userId, courseId) => {
    const [enrollment, created] = await Enrollment.findOrCreate({
        where: { user_id: userId, course_id: courseId },
        defaults: { enrolled_at: new Date(), progress_percent: 0 },
    });

    if (!created) {
        throw createError(409, 'Користувач вже записаний на курс.');
    }

    return { message: 'Успішна реєстрація на курс.' };
};

exports.unenroll = async (userId, courseId) => {
    const enrollment = await Enrollment.findOne({
        where: { user_id: userId, course_id: courseId },
    });
    if (!enrollment) throw createError(404, 'Запис не знайдено.');
    await enrollment.destroy();
    return { message: 'Користувача відписано від курсу.' };
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
