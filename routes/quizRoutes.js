const express = require('express');
const router = express.Router();
const { validateQuiz } = require('../middlewares/quizValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const quizController = require('../controllers/quizController');

router.post('/', authMiddleware, validateQuiz, quizController.createQuiz);
router.put('/:id', authMiddleware, quizController.loadQuiz, validateQuiz, quizController.updateQuiz);
router.delete('/:id', authMiddleware, quizController.loadQuiz, quizController.deleteQuiz);
router.get('/:id', authMiddleware, quizController.getQuizById);
router.get('/by-lesson/:lessonId', authMiddleware, quizController.getQuizzesByLesson);
router.get('/:id/result', authMiddleware, quizController.getQuizResult);

module.exports = router;
