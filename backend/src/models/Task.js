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
    allowNull: false,
    defaultValue: 10,
  },
  expectedResultUrl: {           
    type: DataTypes.STRING,
    allowNull: true,
  },
  allowSelfCheck: {             
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, { timestamps: true });

Lesson.hasMany(Task, { foreignKey: 'lessonId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Lesson, { foreignKey: 'lessonId' });

module.exports = Task;