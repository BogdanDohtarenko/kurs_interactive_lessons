const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');

// Публичный маршрут
router.get('/', getCourses);

// Защищенные маршруты (требуют наличия токена)
router.post('/', protect, createCourse);
router.put('/:id', protect, updateCourse);
router.delete('/:id', protect, deleteCourse);

module.exports = router;