const Exam = require('../models/Exam');
const Event = require('../models/Event');

const createExam = async (req, res) => {
  try {
    const exam = await Exam.create(req.body);

    // Create associated event
    await Event.create({
      user_id: exam.user_id,
      title: exam.title,
      description: exam.description,
      type: 'exam',
      reference_id: exam._id,
      date: exam.date,
      start_time: exam.start_time,
      end_time: exam.end_time,
    });

    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create exam', error });
  }
};

const updateExam = async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
  
      const updatedExam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
  
      // Update related event
      await Event.findOneAndUpdate(
        { reference_id: updatedExam._id, type: 'exam' },
        {
          title: updatedExam.title,
          description: updatedExam.description,
          date: updatedExam.date,
          start_time: updatedExam.start_time,
          end_time: updatedExam.end_time,
        }
      );
  
      res.json(updatedExam);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update exam', error });
    }
  };

  const deleteExam = async (req, res) => {
    try {
      const exam = await Exam.findById(req.params.id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
  
      await Exam.findByIdAndDelete(req.params.id);
  
      // Delete associated event
      await Event.deleteOne({ reference_id: exam._id, type: 'exam' });
  
      res.json({ message: 'Exam and related event deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete exam', error });
    }
  };

  const getUserExams = async (req, res) => {
    try {
      const exams = await Exam.find({ user_id: req.user._id }).populate('subject_id', 'name');
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch exams', error });
    }
  };
  
  module.exports = {
    createExam,
    updateExam,
    deleteExam,
    getUserExams,
  };