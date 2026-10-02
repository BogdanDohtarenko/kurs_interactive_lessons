const Task = require('../models/Task');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Get all tasks for a specific lesson
// @route   GET /api/tasks/lesson/:lessonId
// @access  Public
const getTasksByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const tasks = await Task.findAll({ where: { lessonId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении заданий', error: error.message });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { description, maxScore, lessonId } = req.body;

    const lesson = await Lesson.findByPk(lessonId, {
      include: [{ model: Course }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }

    if (lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для добавления задания в этот урок' });
    }

    const task = await Task.create({
      description,
      maxScore,
      lessonId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании задания', error: error.message });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, maxScore } = req.body;

    const task = await Task.findByPk(id, {
      include: [{
        model: Lesson,
        include: [{ model: Course }]
      }]
    });

    if (!task) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }

    if (task.Lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для изменения этого задания' });
    }

    await task.update({ description, maxScore });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении задания', error: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByPk(id, {
      include: [{
        model: Lesson,
        include: [{ model: Course }]
      }]
    });

    if (!task) {
      return res.status(404).json({ message: 'Задание не найдено' });
    }

    if (task.Lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для удаления этого задания' });
    }

    await task.destroy();
    res.json({ message: 'Задание успешно удалено' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении задания', error: error.message });
  }
};

module.exports = {
  getTasksByLesson,
  createTask,
  updateTask,
  deleteTask
};