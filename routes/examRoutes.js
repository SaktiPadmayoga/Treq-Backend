const express = require('express');
const router = express.Router();
const {
  createExam,
  updateExam,
  deleteExam,
  getUserExams
} = require('../controllers/examController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createExam);
router.put('/:id', protect, updateExam);
router.delete('/:id', protect, deleteExam);
router.get('/', protect, getUserExams);

module.exports = router;
