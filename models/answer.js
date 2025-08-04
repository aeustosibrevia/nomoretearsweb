const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Question = require("./question");

const Answer = sequelize.define('answer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answer_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    tableName: 'answer',
    timestamps: false
});

Answer.belongsTo(Question, { foreignKey: 'question_id', as: 'question' });
Question.hasMany(Answer, { foreignKey: 'question_id', as: 'answers' });

module.exports = Answer;
