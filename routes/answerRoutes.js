const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateAnswer, validateAnswersReplace } = require('../middlewares/answerValidator');
const answerController = require('../controllers/answerController');
const { requireActiveEnrollmentByResource } = require('../middlewares/enrollmentGuard');

router.post('/', authMiddleware, validateAnswer, answerController.createAnswer);

router.put('/replace', authMiddleware, validateAnswersReplace, answerController.replaceAnswersForQuestion);

router.get('/with-correct', authMiddleware, answerController.getAnswersByQuestionWithCorrect);

router.get('/', authMiddleware, requireActiveEnrollmentByResource(), answerController.getAnswersByQuestion);

router.get('/:id', authMiddleware, (req,_res,next)=>{req.query.answer_id=req.params.id;next();}, requireActiveEnrollmentByResource(), answerController.getAnswerById);

router.put('/:id', authMiddleware, answerController.loadAnswer, validateAnswer, answerController.updateAnswer);

router.delete('/:id', authMiddleware, answerController.loadAnswer, answerController.deleteAnswer);

module.exports = router;