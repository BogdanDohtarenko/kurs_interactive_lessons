const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Lesson = require('./Lesson');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  maxScore: {
    type: DataTypes.INTEGER,
    defaultValue: 10, // Максимальный балл за задание
  }
}, {
  timestamps: true,
});

Lesson.hasMany(Task, { foreignKey: 'lessonId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Lesson, { foreignKey: 'lessonId' });

module.exports = Task;