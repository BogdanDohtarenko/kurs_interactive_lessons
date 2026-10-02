const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Lesson = require('./Lesson');

const Test = sequelize.define('Test', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questions: {
    type: DataTypes.JSONB, // Храним массив вопросов и вариантов ответов в формате JSON
    allowNull: false,
    defaultValue: []
  },
  passingScore: {
    type: DataTypes.INTEGER,
    defaultValue: 70, // Процент для успешного прохождения
  }
}, {
  timestamps: true,
});

// Связь: Один Урок имеет один Тест (или много, если нужно)
Lesson.hasOne(Test, { foreignKey: 'lessonId', onDelete: 'CASCADE' });
Test.belongsTo(Lesson, { foreignKey: 'lessonId' });

module.exports = Test;