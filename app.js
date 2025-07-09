const dotenv = require('dotenv');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./utils/passport');




const app = express();
dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(express.json({limit: '10mb'}));
const PORT = process.env.PORT || 3000;

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Забагато запитів, спробуйте пізніше' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(generalLimiter);
app.use('/', authRoutes);


app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});