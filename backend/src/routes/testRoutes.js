const express = require('express');
const router = express.Router();
const {
  getTestByLesson,
  createTest,
  updateTest,
  deleteTest
} = require('../controllers/testController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/lesson/:lessonId', getTestByLesson);
router.post('/', protect, createTest);
router.put('/:id', protect, updateTest);
router.delete('/:id', protect, deleteTest);

module.exports = router;