const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  start_time: String,
  end_time: String,
  location: String,
});

module.exports = mongoose.model('Exam', examSchema);
