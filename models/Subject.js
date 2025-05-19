const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    start_time: { type: String },
    end_time: { type: String },
    room: { type: String },
});

module.exports = mongoose.model('Subject', subjectSchema);
