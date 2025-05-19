const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getMe,
  updateMe,
  deleteMe
} = require('../controllers/userController');

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.delete("/me", protect, deleteMe);

module.exports = router;
