const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategory } = require('../middlewares/categoryValidator');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/',authMiddleware, validateCategory, categoryController.createCategory);
router.put('/:id', authMiddleware, categoryController.loadCategory, validateCategory, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

module.exports = router;
