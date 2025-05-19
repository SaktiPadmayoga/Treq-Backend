const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    type: { type: String, enum: ['subject', 'task', 'exam'] },
    reference_id: { type: mongoose.Schema.Types.ObjectId },
    date: Date,
    start_time: String,
    end_time: String
});

module.exports = mongoose.model('Event', eventSchema);