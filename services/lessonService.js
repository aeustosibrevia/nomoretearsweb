const createError = require('http-errors');
const Lesson = require('../models/lesson');
const Course = require('../models/course');
const LessonProgress = require('../models/lessonProgress');
const enrollmentService = require('./enrollmentService');
const Enrollment = require('../models/enrollment');
const generateSlug = require('../utils/slug');


exports.createLesson = async (data, user) => {
    const course = await Course.findByPk(data.course_id);
    if (!course) {
        throw createError(404, "Курс не знайдено.");
    }

    const isAdmin = user.role === 'admin';
    const isOwnerInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!isAdmin && !isOwnerInstructor) {
        throw createError(403, "У вас немає прав для додавання уроку до цього курсу.");
    }

    const newLesson = await Lesson.create({
        course_id: data.course_id,
        title: data.title,
        slug: generateSlug(data.title),
        video_data: data.video_data,
        content: data.content
    });

    return {
        message: "Урок успішно створено.",
        lessonId: newLesson.id
    };
};

exports.updateLesson = async (id, data, user) => {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
        throw createError(404, "Урок не знайдено.");
    }

    const course = await Course.findByPk(lesson.course_id);
    if (!course) {
        throw createError(404, "Пов’язаний курс не знайдено.");
    }

    const isAdmin = user.role === 'admin';
    const isOwnerInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!isAdmin && !isOwnerInstructor) {
        throw createError(403, "У вас немає прав для редагування цього уроку.");
    }

    if (data.title) {
        lesson.title = data.title;
        lesson.slug = generateSlug(data.title);
    }

    lesson.video_data = data.video_data ?? lesson.video_data;
    lesson.content = data.content ?? lesson.content;
    lesson.course_id = data.course_id ?? lesson.course_id;

    await lesson.save();

    return {
        message: "Урок успішно оновлено.",
        lessonId: lesson.id
    };
};

exports.deleteLesson = async (id, user) => {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
        throw createError(404, "Урок не знайдено.");
    }

    const course = await Course.findByPk(lesson.course_id);
    if (!course) {
        throw createError(404, "Пов’язаний курс не знайдено.");
    }

    const isAdmin = user.role === 'admin';
    const isOwnerInstructor = user.role === 'instructor' && user.userId === course.instructor_id;

    if (!isAdmin && !isOwnerInstructor) {
        throw createError(403, "У вас немає прав для видалення цього уроку.");
    }

    await lesson.destroy();

    return {
        message: "Урок успішно видалено.",
        lessonId: lesson.id
    };
};

exports.markLessonAsFinished = async (userId, lessonId) => {
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
        throw createError(404, "Урок не знайдено.");
    }

    const isEnrolled = await Enrollment.findOne({
        where: { user_id: userId, course_id: lesson.course_id }
    });

    if (!isEnrolled) {
        throw createError(403, "Ви не записані на цей курс.");
    }

    const [progress, created] = await LessonProgress.findOrCreate({
        where: { user_id: userId, lesson_id: lessonId },
        defaults: {
            is_finished: true,
            finished_at: new Date()
        }
    });

    if (!created) {
        progress.is_finished = true;
        progress.finished_at = new Date();
        await progress.save();
    }

    await enrollmentService.updateProgress(userId, lesson.course_id);

    return {
        message: "Урок позначено як завершений.",
        lessonId: lessonId
    };
};

exports.unmarkLessonAsFinished = async (userId, lessonId) => {
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
        throw createError(404, "Урок не знайдено.");
    }

    const isEnrolled = await Enrollment.findOne({
        where: { user_id: userId, course_id: lesson.course_id }
    });

    if (!isEnrolled) {
        throw createError(403, "Ви не записані на цей курс.");
    }

    const [progress, created] = await LessonProgress.findOrCreate({
        where: { user_id: userId, lesson_id: lessonId },
        defaults: {
            is_finished: false,
            finished_at: null
        }
    });

    if (!created) {
        progress.is_finished = false;
        progress.finished_at = null;
        await progress.save();
    }

    await enrollmentService.updateProgress(userId, lesson.course_id);

    return {
        message: "Урок позначено як не завершений.",
        lessonId: lessonId
    };
};

exports.getBySlugs = async (categorySlug, courseSlug, lessonSlug, user) => {
    const lesson = await Lesson.findOne({
        where: { slug: lessonSlug },
        include: [{
            model: Course,
            as: 'course',
            where: { slug: courseSlug },
            include: [{
                association: 'category',
                where: { slug: categorySlug }
            }]
        }]
    });

    if (!lesson) throw createError(404, "Урок не знайдено");

    const course = lesson.course;

    const isAdminOrOwner = user?.role === 'admin' || user?.userId === course.instructor_id;
    if (!course.is_published && !isAdminOrOwner) {
        throw createError(403, "Курс ще не опубліковано");
    }

    let isEnrolled = false;
    let enrollment = null;

    if (user?.userId) {
        enrollment = await Enrollment.findOne({
            where: {
                user_id: user.userId,
                course_id: course.id
            }
        });
        isEnrolled = !!enrollment;
    }

    if (!isEnrolled && !isAdminOrOwner) {
        throw createError(403, "Ви не маєте доступу до цього уроку");
    }

    return lesson;
};




