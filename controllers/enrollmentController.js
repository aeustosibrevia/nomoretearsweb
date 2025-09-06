const enrollmentService = require('../services/enrollmentService');

exports.enroll = async (req, res, next) => {
    try {
        const { username, courseId } = req.params;
        const result = await enrollmentService.enroll(username, courseId, req.user);
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

exports.unenroll = async (req, res, next) => {
    try {
        const { username, courseId } = req.params;
        const result = await enrollmentService.unenroll(username, courseId, req.user);
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

exports.listMine = async (req, res, next) => {
    try {
        const result = await enrollmentService.listByUserId(req.user.userId);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.listByUsernameAdmin = async (req, res, next) => {
    try {
        const { username } = req.params;
        const result = await enrollmentService.listByUsernameForAdmin(username, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

exports.listByUserIdAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await enrollmentService.listByUserId(userId, req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
};
