const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Получить список всех опубликованных курсов
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isPublished: true },
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }] // Подтягиваем имя автора
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении курсов', error: error.message });
  }
};

// @desc    Создать новый курс
// @route   POST /api/courses
// @access  Private (любой авторизованный пользователь, или только teacher/admin)
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const course = await Course.create({
      title,
      description,
      authorId: req.user.id // Берем ID из токена, который подставил authMiddleware
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании курса', error: error.message });
  }
};

// @desc    Обновить данные курса
// @route   PUT /api/courses/:id
// @access  Private (только автор или админ)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isPublished } = req.body;

    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    // Проверка прав: редактировать может только автор курса или администратор
    if (course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'У вас нет прав для изменения этого курса' });
    }

    await course.update({ title, description, isPublished });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении курса', error: error.message });
  }
};

// @desc    Удалить курс
// @route   DELETE /api/courses/:id
// @access  Private (только автор или админ)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByPk(id);

    if (!course) {
      return res.status(404).json({ message: 'Курс не найден' });
    }

    if (course.authorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'У вас нет прав для удаления этого курса' });
    }

    await course.destroy();
    res.json({ message: 'Курс успешно удален' });
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при удалении курса', error: error.message });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
};