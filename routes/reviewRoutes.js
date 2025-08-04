const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { validateReview } = require('../middlewares/reviewValidator');
const reviewController = require('../controllers/reviewController');

router.post('/', authMiddleware, validateReview, reviewController.createReview);

router.put('/:id', authMiddleware, reviewController.loadReview, validateReview, reviewController.updateReview);

router.delete('/:id', authMiddleware, reviewController.loadReview, reviewController.deleteReview);



module.exports = router;
