const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const enrollmentController = require('../controllers/enrollmentController');

router.post('/:username/:courseId', authMiddleware, enrollmentController.enroll);
router.delete('/:username/:courseId', authMiddleware, enrollmentController.unenroll);
router.get('/:courseId/progress', authMiddleware, enrollmentController.getProgress);
router.get('/me', authMiddleware, enrollmentController.listMine);
router.get('/admin/by-username/:username', authMiddleware, enrollmentController.listByUsernameAdmin);
router.get('/admin/:userId', authMiddleware, enrollmentController.listByUserIdAdmin);

module.exports = router;
