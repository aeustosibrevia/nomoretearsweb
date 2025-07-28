const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Quiz = require('./quiz');

const Question = sequelize.define('question', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    question_type: {
        type: DataTypes.ENUM('single_choice', 'multiple_choice'),
        allowNull: false
    }
}, {
    tableName: 'question',
    timestamps: false
});

Question.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
Quiz.hasMany(Question, { foreignKey: 'quiz_id', as: 'questions' });

module.exports = Question;
