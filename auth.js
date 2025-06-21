

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const winston = require('winston');
require('dotenv').config();


const app = express();


const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || (() => {
  console.error('ПОМИЛКА: JWT_SECRET не встановлено у змінних середовища!');
  process.exit(1);
})();
const USERS_FILE = path.join(__dirname, 'users.json');
const SALT_ROUNDS = 12;


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'auth-server' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});



const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


app.use(helmet());
app.use(express.json({ limit: '10mb' }));

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { error: 'Забагато запитів, спробуйте пізніше' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: { error: 'Забагато спроб входу, спробуйте через 15 хвилин' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);


const validateRegistration = (req, res, next) => {
  const { username, password, email } = req.body;
  const errors = [];

  if (!username || username.length < 3 || username.length > 30) {
    errors.push('Ім’я користувача має містити від 3 до 30 символів');
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Ім’я користувача може містити лише літери, цифри та підкреслення');
  }

  if (!password || password.length < 8) {
    errors.push('Пароль має містити щонайменше 8 символів');
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push('Пароль має містити принаймні одну малу літеру, одну велику літеру та одну цифру');
  }

  if (!email || !validator.isEmail(email)) {
    errors.push('Введіть коректну електронну адресу');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username || !password) {
    errors.push('Ім’я користувача та пароль обов’язкові');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};


async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await saveUsers([]);
      return [];
    }
    logger.error('Помилка завантаження користувачів:', error);
    throw error;
  }
}

async function saveUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    logger.error('Помилка збереження користувачів:', error);
    throw error;
  }
}

const errorHandler = (err, req, res, next) => {
  logger.error('Необроблена помилка:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(500).json({ 
    error: 'Внутрішня помилка сервера',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};

// --------------------------- РЕГИСТРАЦИЯ ---------------------------

app.post('/register', validateRegistration, async (req, res, next) => {
  console.log(req.body)
  try {
    const { username, password, email } = req.body;
    const users = await loadUsers();

    
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(409).json({ error: 'Користувач із таким ім’ям уже існує' });
    }

    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'Користувач з такою електронною адресою вже існує' });
    }

    
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    
    const newUser = {
      id: crypto.randomUUID(),
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);
    await saveUsers(users);

    logger.info(`Нового користувача зареєстровано: ${username}`, {
      userId: newUser.id,
      email: newUser.email
    });

    res.status(201).json({ 
      message: 'Користувача успішно зареєстровано',
      userId: newUser.id
    });

  } catch (error) {
    next(error);
  }
});

// --------------------------- ЛОГИН ---------------------------

app.post('/login', authLimiter, validateLogin, async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const users = await loadUsers();

   
    const user = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && u.isActive
    );

    if (!user) {
      logger.warn(`Спроба входу з неіснуючим користувачем: ${username}`, {
        ip: req.ip
      });
      return res.status(401).json({ error: 'Неправильні облікові дані' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Неправильний пароль для користувача: ${username}`, {
        userId: user.id,
        ip: req.ip
      });
      return res.status(401).json({ error: 'Неправильні облікові дані' });
    }

    
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username 
      }, 
      SECRET, 
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        issuer: 'auth-server'
      }
    );

    logger.info(`Успішний вхід користувача: ${username}`, {
      userId: user.id
    });

    res.json({ 
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
});

// --------------------------- ПРОВЕРКА ТОКЕНА ---------------------------

function authMiddleware(req, res, next) {
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
      logger.error('Помилка перевірки токена:', error);
      return res.status(401).json({ error: 'Помилка авторизації' });
    }
  }
}

// --------------------------- ЗАЩИЩЁННЫЕ МАРШРУТЫ ---------------------------

app.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const users = await loadUsers();
    const user = users.find(u => u.id === req.user.userId && u.isActive);
    
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    next(error);
  }
});

// --------------------------- СБРОС ПАРОЛЯ ---------------------------

app.post('/request-password-reset', authLimiter, async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Введіть коректну email адресу' });
    }

    const users = await loadUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive);

    
    if (!user) {
      logger.warn(`Запит скидання пароля для неіснуючого email: ${email}`);
      return res.json({ message: 'Якщо такий email існує, лист з інструкцією буде надіслано' });
    }

    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = Date.now() + 15 * 60 * 1000; 

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await saveUsers(users);

    
    const resetUrl = `${process.env.FRONTEND_URL || `http://localhost:${PORT}`}/reset-password?token=${resetToken}`;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Скидання пароля',
      html: `
        <h2> Скидання пароля</h2>
        <p>Ви запросили скидання пароля. Якщо це були не ви, проігноруйте цей лист.</p>
        <p>Для скидання пароля перейдіть за посиланням:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color:rgb(58, 129, 243); color: white; text-decoration: none; border-radius: 4px;">Викинути пароль</a>
        <p>Посилання дійсне 15 хвилин.</p>
      `
    });

    logger.info(`Запит скидання пароля для користувача: ${user.username}`, {
      userId: user.id
    });

    res.json({ message: 'Якщо такий email існує, лист з інструкцією буде надіслано' });

  } catch (error) {
    next(error);
  }
});

app.post('/reset-password', authLimiter, async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Токен та новий пароль обов'язкові" });
    }

    if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ 
        error: 'Новий пароль має містити щонайменше 8 символів, включно з малими та великими літерами, цифрами' 
      });
    }

    const users = await loadUsers();
    const user = users.find(u => 
      u.resetToken === token && 
      u.resetTokenExpires > Date.now() && 
      u.isActive
    );

    if (!user) {
      return res.status(400).json({ error: 'Недійсний або протермінований токен' });
    }

    
    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    delete user.resetToken;
    delete user.resetTokenExpires;
    
    await saveUsers(users);

    logger.info(`Пароль успішно скинуто для користувача: ${user.username}`, {
      userId: user.id
    });

    res.json({ message: 'Пароль успішно оновлено' });

  } catch (error) {
    next(error);
  }
});

// --------------------------- ДОПОЛНИТЕЛЬНЫЕ МАРШРУТЫ ---------------------------


app.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Введіть коректну email адресу' });
    }

    const users = await loadUsers();
    const user = users.find(u => u.id === req.user.userId && u.isActive);
    
    if (!user) {
      return res.status(404).json({ error: 'Користувач не знайдений' });
    }

    if (email && email !== user.email) {
     
      const emailExists = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && u.id !== user.id
      );
      
      if (emailExists) {
        return res.status(409).json({ error: 'Цей email уже використовується' });
      }
      
      user.email = email.toLowerCase().trim();
    }

    await saveUsers(users);

    res.json({
      message: 'Профіль оновлено',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
});


app.post('/change-password', authMiddleware, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Поточний і новий пароль обов'язкові" });
    }

    if (newPassword.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ 
        error: 'Новий пароль має містити щонайменше 8 символів, включно з малими та великими літерами, цифрами' 
      });
    }

    const users = await loadUsers();
    const user = users.find(u => u.id === req.user.userId && u.isActive);
    
    if (!user) {
      return res.status(404).json({ error: 'Користувача не знайдено' });
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Неправильний поточний пароль' });
    }

    user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await saveUsers(users);

    logger.info(`Пароль змінено користувачем: ${user.username}`, {
      userId: user.id
    });

    res.json({ message: 'Пароль успішно змінено' });

  } catch (error) {
    next(error);
  }
});

// Выход (чернлист токенов в реальном приложении должен храниться в Redis)
app.post('/logout', authMiddleware, (req, res) => {
  logger.info(`Користувач вийшов із системи: ${req.user.username}`, {
    userId: req.user.userId
  });
  
  res.json({ message: 'Успішний вихід із системи' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

//  //404 обработчик
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Маршрут не знайдено' });
// });

// Middleware для обработки ошибок
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM отримано, завершуємо сервер...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT отримано, завершуємо сервер...');
  process.exit(0);
});

// --------------------------- ЗАПУСК СЕРВЕРА ---------------------------

app.listen(PORT, () => {
  logger.info(`Сервер запущено на http://localhost:${PORT}`);
  console.log(`🚀 Сервер запущено на http://localhost:${PORT}`);
});