const {DataTypes} = require('sequelize');
const sequelize = require('./index');
const Lesson = require("./lesson");

const Quiz = sequelize.define('quiz', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    lesson_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
},
    {
        tableName: 'quiz',
        timestamps: false
    }
)

Quiz.belongsTo(Lesson, {foreignKey: 'lesson_id', as: 'lesson'});
Lesson.hasMany(Quiz, {foreignKey: 'lesson_id'});

module.exports = Quiz;