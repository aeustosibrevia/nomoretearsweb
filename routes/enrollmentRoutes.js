const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const enrollmentController = require('../controllers/enrollmentController');

router.post('/:courseId', authMiddleware, enrollmentController.enroll);
router.delete('/:courseId', authMiddleware, enrollmentController.unenroll);
router.get('/:courseId/progress', authMiddleware, enrollmentController.getProgress);

module.exports = router;