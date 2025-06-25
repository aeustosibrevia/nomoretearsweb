const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendResetEmail = async (email, resetUrl) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Скидання пароля',
        html: `
      <h2>Скидання пароля</h2>
      <p>Ви запросили скидання пароля. Якщо це були не ви, проігноруйте цей лист.</p>
      <p>Для скидання пароля перейдіть за посиланням:</p>
      <a href="${resetUrl}" style="padding: 10px; background: #007BFF; color: white; text-decoration: none;">Скинути пароль</a>
      <p>Посилання дійсне 15 хвилин.</p>
    `
    });
};