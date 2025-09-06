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
    role: DataTypes.ENUM('student', 'admin', 'instructor'),
    created_at: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
    reset_token: DataTypes.TEXT,
    reset_token_expires: DataTypes.BIGINT,
    profile_picture: DataTypes.TEXT,
    phone_number: DataTypes.STRING,
    birthday: DataTypes.DATE,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    is_superadmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {
    tableName: 'user',
    timestamps: false
});

module.exports = User;
