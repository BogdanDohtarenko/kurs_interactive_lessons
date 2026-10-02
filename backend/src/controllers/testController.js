const Test = require('../models/Test');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Get test for a specific lesson
// @route   GET /api/tests/lesson/:lessonId
// @access  Public
const getTestByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const test = await Test.findOne({ where: { lessonId } });

    if (!test) {
      return res.status(404).json({ message: 'Тест для данного урока не найден' });
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении теста', error: error.message });
  }
};

// @desc    Create a new test
// @route   POST /api/tests
// @access  Private
const createTest = async (req, res) => {
  try {
    const { title, questions, passingScore, lessonId } = req.body;

    const lesson = await Lesson.findByPk(lessonId, {
      include: [{ model: Course }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }

    // Auth check: only course author or admin
    if (lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для добавления теста в этот урок' });
    }

    // Check if test already exists for this lesson (assuming 1 test per lesson)
    const existingTest = await Test.findOne({ where: { lessonId } });
    if (existingTest) {
      return res.status(400).json({ message: 'У этого урока уже есть тест. Вы можете обновить его.' });
    }

    const test = await Test.create({
      title,
      questions,
      passingScore,
      lessonId
    });

    res.status(201).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании теста', error: error.message });
  }
};

// @desc    Update a test
// @route   PUT /api/tests/:id
// @access  Private
const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questions, passingScore } = req.body;

    const test = await Test.findByPk(id, {
      include: [{
        model: Lesson,
        include: [{ model: Course }]
      }]
    });

    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    if (test.Lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для изменения этого теста' });
    }

    await test.update({ title, questions, passingScore });
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении теста', error: error.message });
  }
};

// @desc    Delete a test
// @route   DELETE /api/tests/:id
// @access  Private
const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const test = await Test.findByPk(id, {
      include: [{
        model: Lesson,
        include: [{ model: Course }]
      }]
    });

    if (!test) {
      return res.status(404).json({ message: 'Тест не найден' });
    }

    if (test.Lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав для удаления этого теста' });
    }

    await test.destroy();
    res.json({ message: 'Тест успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении теста', error: error.message });
  }
};

module.exports = {
  getTestByLesson,
  createTest,
  updateTest,
  deleteTest
};