const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');
const Lesson = require('./lesson');

const LessonProgress = sequelize.define('lesson_progress', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    lesson_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_finished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    finished_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'lesson_progress',
    timestamps: false
});

LessonProgress.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(LessonProgress, { foreignKey: 'user_id' });

LessonProgress.belongsTo(Lesson, { foreignKey: 'lesson_id' });
Lesson.hasMany(LessonProgress, { foreignKey: 'lesson_id' });

module.exports = LessonProgress;
