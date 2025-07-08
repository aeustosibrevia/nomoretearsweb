const jwt = require('jsonwebtoken');
require('dotenv').config(); // обязательно

const SECRET = process.env.JWT_SECRET;


module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Токен не надано' });
    }

    const token = authHeader.substring(7);

    try {
        const payload = jwt.verify(token, SECRET, { issuer: 'auth-server' });
        req.user = payload;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Токен закінчився' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Недійсний токен' });
        } else {
            return res.status(401).json({ error: 'Помилка авторизації' });
        }
    }
};