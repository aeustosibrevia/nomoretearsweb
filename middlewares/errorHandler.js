module.exports = (err, req, res, next) => {
    console.error('Server error:', err);

    const status = err.status || 500;

    const message = status === 500
        ? 'Внутрішня помилка серверу'
        : err.message;

    res.status(status).json({ error: message });
};
