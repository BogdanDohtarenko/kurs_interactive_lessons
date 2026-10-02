const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Получить все уроки конкретного курса
// @route   GET /api/lessons/course/:courseId
// @access  Public (или Private, если курс закрытый)
const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Проверяем, существует ли курс
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    const lessons = await Lesson.findAll({
      where: { courseId },
      order: [['order', 'ASC']] // Сортируем уроки по порядковому номеру
    });

    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении уроков', error: error.message });
  }
};

// @desc    Получить конкретный урок по ID
// @route   GET /api/lessons/:id
// @access  Public
const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const lesson = await Lesson.findByPk(id);

    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении урока', error: error.message });
  }
};

// @desc    Создать новый урок
// @route   POST /api/lessons
// @access  Private (только автор курса или админ)
const createLesson = async (req, res) => {
  try {
    const { title, content, videoUrl, order, courseId } = req.body;

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    // Проверка прав: только автор курса или админ может добавлять уроки
    if (course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'У вас нет прав для добавления урока в этот курс' });
    }

    const lesson = await Lesson.create({
      title,
      content,
      videoUrl,
      order,
      courseId
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании урока', error: error.message });
  }
};

// @desc    Обновить урок
// @route   PUT /api/lessons/:id
// @access  Private (только автор курса или админ)
const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl, order } = req.body;

    const lesson = await Lesson.findByPk(id, {
      include: [{ model: Course, attributes: ['authorId'] }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }

    // Проверка прав (берем authorId из привязанного курса)
    if (lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'У вас нет прав для изменения этого урока' });
    }

    await lesson.update({ title, content, videoUrl, order });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении урока', error: error.message });
  }
};

// @desc    Удалить урок
// @route   DELETE /api/lessons/:id
// @access  Private (только автор курса или админ)
const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    
    const lesson = await Lesson.findByPk(id, {
      include: [{ model: Course, attributes: ['authorId'] }]
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Урок не найден' });
    }

    if (lesson.Course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'У вас нет прав для удаления этого урока' });
    }

    await lesson.destroy();
    res.json({ message: 'Урок успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении урока', error: error.message });
  }
};

module.exports = {
  getLessonsByCourse,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
};