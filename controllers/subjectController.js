    const Subject = require('../models/Subject');
    const Event = require('../models/Event'); // import

const createSubject = async (req, res) => {
    try {
        const { name, day, start_time, end_time, room } = req.body;

        const subject = await Subject.create({
        user_id: req.user.id,
        name,
        day,
        start_time,
        end_time,
        room,
        });

        // Konversi day ke tanggal terdekat
        const currentDate = new Date();
        const daysMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        };
        const dayNumber = daysMap[day];
        const diff = (dayNumber + 7 - currentDate.getDay()) % 7;
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() + diff);

        // CREATE event
        await Event.create({
        user_id: req.user.id,
        title: name,
        description: `Subject in ${room}`,
        type: 'subject',
        reference_id: subject._id,
        date: nextDate,
        start_time,
        end_time,
        });

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subject', error });
    }
};


    // GET all subjects for a user
const getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({ user_id: req.user.id }).sort({ day: 1, start_time: 1 });
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subjects', error });
    }
};

    // GET single subject by ID
const getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findOne({ _id: req.params.id, user_id: req.user.id });

        if (!subject) return res.status(404).json({ message: 'Subject not found' });

        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get subject', error });
    }
};

    // UPDATE subject
    const updateSubject = async (req, res) => {
        try {
          const subject = await Subject.findById(req.params.id);
          if (!subject) return res.status(404).json({ message: 'Subject not found' });
      
          const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
          );
      
          // Recalculate next date
          const daysMap = {
            Sunday: 0,
            Monday: 1,
            Tuesday: 2,
            Wednesday: 3,
            Thursday: 4,
            Friday: 5,
            Saturday: 6,
          };
          const currentDate = new Date();
          const dayNumber = daysMap[updatedSubject.day];
          const diff = (dayNumber + 7 - currentDate.getDay()) % 7;
          const nextDate = new Date(currentDate);
          nextDate.setDate(currentDate.getDate() + diff);
      
          // Update event
          await Event.findOneAndUpdate(
            { reference_id: subject._id, type: 'subject' },
            {
              title: updatedSubject.name,
              description: `Subject in ${updatedSubject.room}`,
              date: nextDate,
              start_time: updatedSubject.start_time,
              end_time: updatedSubject.end_time,
            }
          );
      
          res.json(updatedSubject);
        } catch (error) {
          res.status(500).json({ message: 'Failed to update subject', error });
        }
      };
      

    // DELETE subject
const deleteSubject = async (req, res) => {
    try {
        const deleted = await Subject.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });

        if (!deleted) return res.status(404).json({ message: 'Subject not found' });

        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subject', error });
    }
};

module.exports = {
    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject,
};
