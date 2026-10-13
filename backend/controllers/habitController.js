const Habit = require('../models/Habit');

const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createHabit = async (req, res) => {
    try {
        const { title, category } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Please provide a habit title' });
        }

        const habit = await Habit.create({
            user: req.user._id,
            title,
            category: category || 'General',
        });

        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const targetDate = req.body.date || new Date().toISOString().split('T')[0];

        const habit = await Habit.findById(id);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' })
        }

        const alreadyCompleted = habit.completedDates.includes(targetDate);
        if (alreadyCompleted) {
            habit.completedDates = habit.completedDates.filter((d) => d !== targetDate);
        } else {
            habit.completedDates.push(targetDate);
        }
        habit.currentStreak = habit.completedDates.length;
        if (habit.currentStreak > habit.longestStreak) {
            habit.longestStreak = habit.currentStreak;
        }

        await habit.save();
        res.status(200).json(habit);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    const habit = await Habit.findOneAndDelete({ _id: id, user: req.user._id });

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    getHabits,
    createHabit,
    toggleHabit,
    deleteHabit
}