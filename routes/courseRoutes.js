const express = require('express');
const router = express.Router();
const { validateCourse } = require('../middlewares/courseValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const courseController = require("../controllers/courseController");

router.post('/', authMiddleware, validateCourse, courseController.createCourse);
router.put('/:id', authMiddleware, courseController.loadCourse, validateCourse, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);
router.get('/', courseController.getAllCourses);
router.put('/:id/publish', authMiddleware, courseController.publishCourse);
router.put('/:id/unpublish', authMiddleware, courseController.unpublishCourse);
router.get('/slugs', courseController.listSlugsWithCategoryIds);
router.get('/:id', authMiddleware, courseController.getCourseById);


module.exports = router;
