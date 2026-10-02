const express = require('express');
const router = express.Router();
const {
  getTasksByLesson,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/lesson/:lessonId', getTasksByLesson);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;