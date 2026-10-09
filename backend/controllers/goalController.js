const Goal = require('../models/Goal');

// @desc    Get all goals for current user
// @route   GET /api/goals
// @access  Private
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error('[Get Goals Error]:', error.message);
    res.status(500).json({ message: 'Failed to retrieve goals' });
  }
};

// @desc    Create a new goal plan
// @route   POST /api/goals
// @access  Private
const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      color,
      targetDate,
      targetMetric,
      habits,
      reminderEnabled,
      reminderType,
      reminderCategory,
      reminderTime,
      reminderIntervalHours,
      reminderStartHour,
      reminderEndHour,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Goal title is required' });
    }

    const formattedHabits = (habits || []).map((h, index) => ({
      id: h.id || `gh_${Date.now()}_${index}`,
      title: h.title.trim(),
      frequency: h.frequency || 'daily',
      targetDays: Number(h.targetDays) || 7,
      completedDates: h.completedDates || [],
    }));

    const goal = await Goal.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      category: category || 'Diet & Nutrition',
      color: color || 'emerald',
      targetDate: targetDate || '',
      targetMetric: targetMetric || '',
      habits: formattedHabits,
      status: 'active',
      reminderEnabled: Boolean(reminderEnabled),
      reminderType: reminderType || 'interval',
      reminderCategory: reminderCategory || 'hydration',
      reminderTime: reminderTime || '09:00',
      reminderIntervalHours: Number(reminderIntervalHours) || 2,
      reminderStartHour: Number(reminderStartHour) || 8,
      reminderEndHour: Number(reminderEndHour) || 21,
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('[Create Goal Error]:', error.message);
    res.status(500).json({ message: error.message || 'Failed to create goal plan' });
  }
};

// @desc    Update a goal plan
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this goal' });
    }

    const {
      title,
      description,
      category,
      color,
      targetDate,
      targetMetric,
      status,
      habits,
      reminderEnabled,
      reminderType,
      reminderCategory,
      reminderTime,
      reminderIntervalHours,
      reminderStartHour,
      reminderEndHour,
    } = req.body;

    if (title) goal.title = title.trim();
    if (description !== undefined) goal.description = description.trim();
    if (category) goal.category = category;
    if (color) goal.color = color;
    if (targetDate !== undefined) goal.targetDate = targetDate;
    if (targetMetric !== undefined) goal.targetMetric = targetMetric;
    if (status) goal.status = status;
    if (reminderEnabled !== undefined) goal.reminderEnabled = Boolean(reminderEnabled);
    if (reminderType !== undefined) goal.reminderType = reminderType;
    if (reminderCategory !== undefined) goal.reminderCategory = reminderCategory;
    if (reminderTime !== undefined) goal.reminderTime = reminderTime;
    if (reminderIntervalHours !== undefined) goal.reminderIntervalHours = Number(reminderIntervalHours);
    if (reminderStartHour !== undefined) goal.reminderStartHour = Number(reminderStartHour);
    if (reminderEndHour !== undefined) goal.reminderEndHour = Number(reminderEndHour);
    if (habits) {
      goal.habits = habits.map((h, index) => ({
        id: h.id || `gh_${Date.now()}_${index}`,
        title: h.title.trim(),
        frequency: h.frequency || 'daily',
        targetDays: Number(h.targetDays) || 7,
        completedDates: h.completedDates || [],
      }));
    }

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    console.error('[Update Goal Error]:', error.message);
    res.status(500).json({ message: error.message || 'Failed to update goal plan' });
  }
};

// @desc    Delete a goal plan
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this goal' });
    }

    await goal.deleteOne();
    res.json({ message: 'Goal plan deleted successfully', id: req.params.id });
  } catch (error) {
    console.error('[Delete Goal Error]:', error.message);
    res.status(500).json({ message: 'Failed to delete goal plan' });
  }
};

// @desc    Toggle a sub-habit date within a goal plan
// @route   POST /api/goals/:id/habits/:habitId/toggle
// @access  Private
const toggleGoalHabit = async (req, res) => {
  try {
    const { id, habitId } = req.params;
    const { date } = req.body; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ message: 'Date is required for toggle' });
    }

    const goal = await Goal.findById(id);
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this goal' });
    }

    const habitIndex = goal.habits.findIndex((h) => h.id === habitId || h._id?.toString() === habitId);
    if (habitIndex === -1) {
      return res.status(404).json({ message: 'Habit not found inside this goal' });
    }

    const habit = goal.habits[habitIndex];
    const exists = habit.completedDates.includes(date);

    if (exists) {
      habit.completedDates = habit.completedDates.filter((d) => d !== date);
    } else {
      habit.completedDates.push(date);
    }

    goal.markModified('habits');
    const updatedGoal = await goal.save();

    res.json(updatedGoal);
  } catch (error) {
    console.error('[Toggle Goal Habit Error]:', error.message);
    res.status(500).json({ message: 'Failed to toggle goal habit' });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoalHabit,
};
