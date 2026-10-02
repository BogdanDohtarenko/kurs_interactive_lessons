const express = require('express');
const router = express.Router();
const { 
  getLessonsByCourse, 
  getLessonById, 
  createLesson, 
  updateLesson, 
  deleteLesson 
} = require('../controllers/lessonController');
const { protect } = require('../middlewares/authMiddleware');

// Публичные маршруты
router.get('/course/:courseId', getLessonsByCourse);
router.get('/:id', getLessonById);

// Защищенные маршруты (требуют наличия токена)
router.post('/', protect, createLesson);
router.put('/:id', protect, updateLesson);
router.delete('/:id', protect, deleteLesson);

module.exports = router;