const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middlewares/authValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const passport = require('passport');

router.post('/login', validateLogin, authController.login);
router.post('/register', validateRegistration, authController.register);
router.post('/logout', authMiddleware, authController.logout);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.post('/changePassword', authMiddleware, authController.changePassword);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);


router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            {
                userId: req.user.id,
                username: req.user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h', issuer: 'auth-server' }
        );

        res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
    }
);

module.exports = router;