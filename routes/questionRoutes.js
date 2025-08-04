const express = require('express');
const router = express.Router();
const { validateQuestion } = require('../middlewares/questionValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const questionController = require("../controllers/questionController");

router.post('/', authMiddleware, validateQuestion, questionController.createQuestion);
router.put('/:id', authMiddleware, questionController.loadQuestion, validateQuestion, questionController.updateQuestion);
router.delete('/:id', authMiddleware, questionController.deleteQuestion);
router.get('/:id', authMiddleware,questionController.loadQuestion, questionController.getQuestion);

module.exports = router;