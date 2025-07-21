const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Course = require('./course');

const Lesson = sequelize.define('lesson', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    video_data: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'lesson',
    timestamps: false
});

Lesson.belongsTo(Course, { foreignKey: 'course_id' });
Course.hasMany(Lesson, { foreignKey: 'course_id' });

module.exports = Lesson;
