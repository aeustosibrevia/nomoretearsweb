module.exports = (err, req, res, next) => {
    console.error('Помилка серверу', err);
    res.status(500).json({error: 'Внутрішнія помилка серверу'});
};