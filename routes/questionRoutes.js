const express = require('express');
const router = express.Router();
const { validateQuestion } = require('../middlewares/questionValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const questionController = require("../controllers/questionController");

router.post('/', authMiddleware, validateQuestion, questionController.createQuestion);
router.put('/:id', authMiddleware, questionController.loadQuestion, validateQuestion, questionController.updateQuestion);
router.get('/:quiz_id', authMiddleware, questionController.getQuestionsByQuiz);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);

module.exports = router;