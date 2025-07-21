const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Enrollment = sequelize.define('enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    enrolled_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    progress_percent: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    }
}, {
    tableName: 'enrollment',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'course_id']
        }
    ]
});

module.exports = Enrollment;
