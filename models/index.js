const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME || "postgres", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    port: process.env.DB_PORT || 3000
});

sequelize.authenticate()
  .then(() => console.log('✅ Підключення до PostgreSQL встановлено'))
  .catch(err => console.error('❌ Не вдалося підключитись:', err));


module.exports = sequelize;
