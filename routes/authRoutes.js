const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/validators');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegistration, authController.register);
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/changePassword', authMiddleware, authController.changePassword);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

module.exports = router;