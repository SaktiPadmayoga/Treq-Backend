const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTaskProgress,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData

} = require('../controllers/taskController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createTask)
  .get(protect, getTasks);

router.route('/progress')
  .get(protect, getMyTaskProgress);

router.route('/:id')
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.patch('/:id/status', protect, updateTaskStatus);
router.patch('/:id/checklist', protect, updateTaskChecklist);
router.get('/dashboard/summary', protect, getDashboardData);


module.exports = router;
