const {DataTypes} = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    google_id: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: DataTypes.ENUM('student', 'admin'),
    created_at: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
    reset_token: DataTypes.TEXT,
    reset_token_expires: DataTypes.BIGINT
}, {
    tableName: 'user',
    timestamps: false
});

module.exports = User;
