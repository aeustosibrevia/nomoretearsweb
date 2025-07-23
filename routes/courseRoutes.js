const express = require('express');
const router = express.Router();
const { validateCourse } = require('../middlewares/courseValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require("../controllers/courseController");

router.post('/', authMiddleware, validateCourse, courseController.createCourse);
router.put('/:id', authMiddleware, courseController.loadCourse, validateCourse, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.put('/:id/publish', authMiddleware, courseController.publishCourse);
router.put('/:id/unpublish', authMiddleware, courseController.unpublishCourse);

module.exports = router;