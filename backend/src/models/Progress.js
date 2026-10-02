const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Lesson = require('./Lesson');

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  isCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0, // Оценка за тесты/задания в этом уроке
  }
}, {
  timestamps: true,
});

// Многие-ко-многим между User и Lesson через таблицу Progress
User.belongsToMany(Lesson, { through: Progress, foreignKey: 'userId', as: 'completedLessons' });
Lesson.belongsToMany(User, { through: Progress, foreignKey: 'lessonId', as: 'studentsProgress' });

module.exports = Progress;