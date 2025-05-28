const Task = require('../models/Task');
const Event = require('../models/Event'); // import

const createTask = async (req, res) => {
    try {
        const {
        subject_id,
        title,
        description,
        status,
        dueDate,
        priority,
        attachment,
        todoChecklist,
        } = req.body;

        const task = await Task.create({
        user_id: req.user.id,
        subject_id,
        title,
        description,
        status,
        dueDate,
        priority,
        attachment,
        todoChecklist,
        });

        // CREATE event
        await Event.create({
        user_id: req.user.id,
        title,
        description,
        type: 'task',
        reference_id: task._id,
        date: dueDate,
        start_time: null,
        end_time: null,
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error });
    }
};

    //  Get All Tasks (User Only)
    const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user_id: req.user.id }).sort({ dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
    };

    // Get Single Task
    const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user_id: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get task', error });
    }
    };

    //  Update Task
    const updateTask = async (req, res) => {
        try {
          const task = await Task.findById(req.params.id);
          if (!task) return res.status(404).json({ message: 'Task not found' });
      
          // Update task fields
          const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
          });
      
          // Update corresponding event
          await Event.findOneAndUpdate(
            { reference_id: task._id, type: 'task' },
            {
              title: updatedTask.title,
              description: updatedTask.description,
              date: updatedTask.dueDate,
            }
          );
      
          res.json(updatedTask);
        } catch (error) {
          res.status(500).json({ message: 'Failed to update task', error });
        }
      };
      

    //  Delete Task
    const deleteTask = async (req, res) => {
        try {
          const task = await Task.findById(req.params.id);
          if (!task) return res.status(404).json({ message: 'Task not found' });
      
          await Task.findByIdAndDelete(req.params.id);
      
          // Delete corresponding event
          await Event.deleteOne({ reference_id: task._id, type: 'task' });
      
          res.json({ message: 'Task and related event deleted' });
        } catch (error) {
          res.status(500).json({ message: 'Failed to delete task', error });
        }
    };


    //  Get Task Progress
    const getMyTaskProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const pending = await Task.countDocuments({ user_id: userId, status: 'Pending' });
        const inProgress = await Task.countDocuments({ user_id: userId, status: 'In Progress' });
        const completed = await Task.countDocuments({ user_id: userId, status: 'Completed' });

        res.status(200).json({
        pending,
        inProgress,
        completed
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get task progress', error });
    }
    };

    const updateTaskStatus = async (req, res) => {
        try {
        const { status } = req.body;
    
        if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
    
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.id },
            { status },
            { new: true }
        );
    
        if (!updatedTask) return res.status(404).json({ message: 'Task not found' });
    
        res.status(200).json(updatedTask);
        } catch (error) {
        res.status(500).json({ message: 'Failed to update status', error });
        }
    };

    const updateTaskChecklist = async (req, res) => {
        try {
        const { checklist } = req.body;
    
        if (!Array.isArray(checklist)) {
            return res.status(400).json({ message: 'Checklist must be an array' });
        }
    
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user_id: req.user.id },
            { todoChecklist: checklist },
            { new: true }
        );
    
        if (!task) return res.status(404).json({ message: 'Task not found' });
    
        res.status(200).json(task);
        } catch (error) {
        res.status(500).json({ message: 'Failed to update checklist', error });
        }
    };
    
    const getDashboardData = async (req, res) => {
        try {
        const userId = req.user.id;
    
        const totalTasks = await Task.countDocuments({ user_id: userId });
    
        const taskStats = await Task.aggregate([
            { $match: { user_id: mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
    
        const upcomingTasks = await Task.find({
            user_id: userId,
            dueDate: { $gte: new Date() }
        }).sort({ dueDate: 1 }).limit(5);
    
        const summary = {
            totalTasks,
            pending: taskStats.find(s => s._id === 'Pending')?.count || 0,
            inProgress: taskStats.find(s => s._id === 'In Progress')?.count || 0,
            completed: taskStats.find(s => s._id === 'Completed')?.count || 0,
            upcomingTasks
        };
    
        res.status(200).json(summary);
        } catch (error) {
        res.status(500).json({ message: 'Failed to get dashboard data', error });
        }
    };


module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getMyTaskProgress,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData
};
