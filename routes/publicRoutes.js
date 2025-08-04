const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const courseController = require('../controllers/courseController');
const lessonController = require('../controllers/lessonController');
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');
const reviewController = require('../controllers/reviewController');

router.get('/courses', categoryController.getAllCategories);

router.get('/courses/:categorySlug', categoryController.getCoursesByCategorySlug);

router.get('/courses/:categorySlug/:courseSlug', courseController.getCourseBySlugs);

router.get('/courses/:categorySlug/:courseSlug/:lessonSlug',authMiddleware, lessonController.getLessonBySlugs);

router.get('/quizzes/:id', quizController.getQuizById);
router.get('/quizzes/by-lesson/:lessonId', quizController.getQuizzesByLesson);

router.get('/questions/:quizId', authMiddleware, questionController.getByQuiz);

router.get('/reviews', reviewController.getReviewsByCourse);
router.get('/reviews/average', reviewController.getAverageRating);

module.exports = router;

