const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCalendarEvents
} = require('../controllers/eventController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getEvents);
router.get('/:id', protect, getEventById);
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/calendar', protect, getCalendarEvents);


module.exports = router;
