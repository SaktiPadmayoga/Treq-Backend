const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});

const taskSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
    title: { type: String, required: true },
    description: String,
    status : { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
    dueDate: { type: Date, required: true },
    priority: { type: String, enum : ['Low', 'Medium', 'High'], default: 'Medium' },
    attachment: [{type: String}],
    progress: { type: Number, default: 0 },
    todoChecklist: [todoSchema],
});

module.exports = mongoose.model('Task', taskSchema);