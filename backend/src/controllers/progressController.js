const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// @desc    Обновить или создать прогресс по уроку
// @route   POST /api/progress/:lessonId
// @access  Private
const updateProgress = async (req, res, next) => {
  try {
    const { lessonId } = req.params;
    const { isCompleted, score } = req.body;
    const userId = req.user.id;

    // Проверяем, существует ли урок
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      res.status(404);
      throw new Error('Урок не найден');
    }

    // Ищем существующую запись прогресса
    let progress = await Progress.findOne({
      where: { userId, lessonId }
    });

    if (progress) {
      // Обновляем, если запись уже есть
      if (isCompleted !== undefined) progress.isCompleted = isCompleted;
      if (score !== undefined) progress.score = score;
      await progress.save();
    } else {
      // Создаем новую, если студент открыл урок впервые
      progress = await Progress.create({
        userId,
        lessonId,
        isCompleted: isCompleted || false,
        score: score || 0
      });
    }

    res.json(progress);
  } catch (error) {
    next(error); // Отправляем ошибку в глобальный errorHandler
  }
};

// @desc    Получить прогресс студента по конкретному курсу
// @route   GET /api/progress/course/:courseId
// @access  Private
const getCourseProgress = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Получаем все уроки курса
    const lessons = await Lesson.findAll({
      where: { courseId },
      attributes: ['id']
    });

    if (!lessons.length) {
      return res.json({ totalLessons: 0, completedLessons: 0, percentage: 0 });
    }

    const lessonIds = lessons.map(lesson => lesson.id);

    // Получаем прогресс пользователя по этим урокам
    const userProgress = await Progress.findAll({
      where: {
        userId,
        lessonId: lessonIds,
        isCompleted: true
      }
    });

    const totalLessons = lessons.length;
    const completedLessons = userProgress.length;
    const percentage = Math.round((completedLessons / totalLessons) * 100);

    res.json({
      totalLessons,
      completedLessons,
      percentage,
      progressDetails: userProgress
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProgress,
  getCourseProgress
};