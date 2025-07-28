const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const courseController = require('../controllers/courseController');
const lessonController = require('../controllers/lessonController');

router.get('/courses', categoryController.getAllCategories);

router.get('/courses/:categorySlug', categoryController.getCoursesByCategorySlug);

router.get('/courses/:categorySlug/:courseSlug', courseController.getCourseBySlugs);

router.get('/courses/:categorySlug/:courseSlug/:lessonSlug',authMiddleware, lessonController.getLessonBySlugs);

module.exports = router;

