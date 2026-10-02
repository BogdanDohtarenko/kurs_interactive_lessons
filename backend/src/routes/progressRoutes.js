const express = require('express');
const router = express.Router();
const { updateProgress, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

// Все маршруты прогресса требуют авторизации (только для залогиненных студентов)
router.post('/:lessonId', protect, updateProgress);
router.get('/course/:courseId', protect, getCourseProgress);

module.exports = router;