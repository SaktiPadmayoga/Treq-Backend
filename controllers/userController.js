const User = require('../models/User');

const getMe = async (req, res) => {
  const userId = req.user._id;
  
    try {
          const user = await User.findById(userId).select('-password');
          if (!user) {
              return res.status(404).json({ message: 'User not found' });
          }
          res.status(200).json(user);
      } catch (error) {
          res.status(500).json({ message: 'Server error', error: error.message });
      }
};

const updateMe = async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
  res.json(updated);
};

const deleteMe = async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  res.json({ message: "User deleted." });
};

module.exports = { getMe, updateMe, deleteMe };
