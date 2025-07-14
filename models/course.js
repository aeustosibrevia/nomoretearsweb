const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Category = require('./category');
const User = require('./user');

const Course = sequelize.define('course', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
    },
    img_data: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    instructor_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'course',
    timestamps: false
});

Course.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Course, { foreignKey: 'category_id' });

Course.belongsTo(User, { foreignKey: 'instructor_id' });
User.hasMany(Course, { foreignKey: 'instructor_id' });

module.exports = Course;
