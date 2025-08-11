const express = require('express');
const router = express.Router();
const { validateLesson } = require('../middlewares/lessonValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const lessonController = require("../controllers/lessonController");
const { requireActiveEnrollmentByResource } = require('../middlewares/enrollmentGuard');

router.post('/', authMiddleware, validateLesson, lessonController.createLesson);
router.put('/:id', authMiddleware, lessonController.loadLesson, validateLesson, lessonController.updateLesson);
router.delete('/:id', authMiddleware, lessonController.deleteLesson);
router.post('/:id/complete',authMiddleware, requireActiveEnrollmentByResource(), lessonController.markLessonAsFinished);
router.post('/:id/uncomplete', authMiddleware, requireActiveEnrollmentByResource(), lessonController.unmarkLessonAsFinished);

module.exports = router;