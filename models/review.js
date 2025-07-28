const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const User = require('./user');
const Course = require('./course');

const Review = sequelize.define('review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'review',
    timestamps: false
});

Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Review.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Course.hasMany(Review, { foreignKey: 'course_id', as: 'reviews' });

module.exports = Review;
