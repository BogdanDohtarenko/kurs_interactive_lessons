const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Course = require('./Course');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT, // Текстовый контент урока
  },
  videoUrl: {
    type: DataTypes.STRING, // Ссылка на видео (опционально)
  },
  order: {
    type: DataTypes.INTEGER, // Порядковый номер урока в курсе
    allowNull: false,
    defaultValue: 1,
  }
}, {
  timestamps: true,
});

// Связи
Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons', onDelete: 'CASCADE' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = Lesson;