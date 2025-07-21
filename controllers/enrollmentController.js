const enrollmentService = require('../services/enrollmentService');

exports.enroll = async (req, res, next) => {
    try {
        const result = await enrollmentService.enroll(req.user.userId, req.params.courseId);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.unenroll = async (req, res, next) => {
    try {
        const result = await enrollmentService.unenroll(req.user.userId, req.params.courseId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.getProgress = async (req, res, next) => {
    try {
        const result = await enrollmentService.getUserProgress(req.user.userId, req.params.courseId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};