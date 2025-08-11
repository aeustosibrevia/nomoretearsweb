const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

const categoryController = require('../controllers/categoryController');
const courseController = require('../controllers/courseController');
const lessonController = require('../controllers/lessonController');
const quizController = require('../controllers/quizController');
const questionController = require('../controllers/questionController');
const reviewController = require('../controllers/reviewController');
const { requireActiveEnrollmentByResource } = require('../middlewares/enrollmentGuard');

router.get('/courses', categoryController.getAllCategories);

router.get('/courses/:categorySlug', categoryController.getCoursesByCategorySlug);

router.get('/courses/:categorySlug/:courseSlug', courseController.getCourseBySlugs);

router.get('/courses/:categorySlug/:courseSlug/:lessonSlug',authMiddleware, requireActiveEnrollmentByResource(), lessonController.getLessonBySlugs);

router.get('/quizzes/:id', authMiddleware, requireActiveEnrollmentByResource(), quizController.getQuizById);
router.get('/quizzes/by-lesson/:lessonId', authMiddleware, requireActiveEnrollmentByResource(), quizController.getQuizzesByLesson);

router.get('/questions/:quizId', authMiddleware, requireActiveEnrollmentByResource(), questionController.getByQuiz);

router.get('/reviews', reviewController.getReviewsByCourse);
router.get('/reviews/average', reviewController.getAverageRating);

module.exports = router;

