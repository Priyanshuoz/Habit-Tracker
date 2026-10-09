const Habit = require('../models/Habit');

// Helper to calculate streaks with skippedDates protection
const computeStreaks = (completedDates = [], skippedDates = []) => {
  if (
    (!completedDates || completedDates.length === 0) &&
    (!skippedDates || skippedDates.length === 0)
  ) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const compSet = new Set(completedDates || []);
  const skipSet = new Set(skippedDates || []);
  const today = new Date();
  const format = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  let currentStreak = 0;
  const cursor = new Date(today);
  const todayStr = format(cursor);

  // If today is neither completed nor skipped, cursor starts checking from yesterday
  if (!compSet.has(todayStr) && !skipSet.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  // Traverse backward day by day
  while (true) {
    const dStr = format(cursor);
    if (compSet.has(dStr)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (skipSet.has(dStr)) {
      // Skipped day bridges the streak without breaking it or penalizing the streak
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate longest streak across history
  const allDates = Array.from(
    new Set([...(completedDates || []), ...(skippedDates || [])])
  ).sort();

  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of allDates) {
    if (!prevDate) {
      tempStreak = compSet.has(dateStr) ? 1 : 0;
    } else {
      const p = new Date(prevDate);
      const c = new Date(dateStr);
      const diff = Math.round((c - p) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        if (compSet.has(dateStr)) tempStreak++;
      } else {
        tempStreak = compSet.has(dateStr) ? 1 : 0;
      }
    }
    prevDate = dateStr;
    if (tempStreak > longestStreak) longestStreak = tempStreak;
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
  };
};

// @desc    Get all habits for logged in user
// @route   GET /api/habits
// @access  Private
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    console.error('[Get Habits Error]:', error.message);
    res.status(500).json({ message: 'Error retrieving habits' });
  }
};

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
const createHabit = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      frequency,
      color,
      targetDays,
      reminderEnabled,
      reminderTime,
      reminderType,
      reminderCategory,
      reminderIntervalHours,
      reminderStartHour,
      reminderEndHour,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please provide a habit title' });
    }

    const habit = await Habit.create({
      user: req.user._id,
      title: title.trim(),
      description: description || '',
      category: category || 'Productivity',
      frequency: frequency || 'daily',
      color: color || 'indigo',
      targetDays: targetDays || 7,
      completedDates: [],
      skippedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      reminderEnabled: Boolean(reminderEnabled),
      reminderTime: reminderTime || '',
      reminderType: reminderType || 'daily',
      reminderCategory: reminderCategory || 'custom',
      reminderIntervalHours: Number(reminderIntervalHours) || 2,
      reminderStartHour: Number(reminderStartHour) || 8,
      reminderEndHour: Number(reminderEndHour) || 21,
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error('[Create Habit Error]:', error.message);
    res.status(500).json({ message: error.message || 'Error creating habit' });
  }
};

// @desc    Update an existing habit
// @route   PUT /api/habits/:id
// @access  Private
const updateHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Ensure user owns habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to update this habit' });
    }

    const {
      title,
      description,
      category,
      frequency,
      color,
      targetDays,
      reminderEnabled,
      reminderTime,
      reminderType,
      reminderCategory,
      reminderIntervalHours,
      reminderStartHour,
      reminderEndHour,
    } = req.body;

    habit.title = title !== undefined ? title : habit.title;
    habit.description = description !== undefined ? description : habit.description;
    habit.category = category !== undefined ? category : habit.category;
    habit.frequency = frequency !== undefined ? frequency : habit.frequency;
    habit.color = color !== undefined ? color : habit.color;
    habit.targetDays = targetDays !== undefined ? targetDays : habit.targetDays;
    if (reminderEnabled !== undefined) habit.reminderEnabled = Boolean(reminderEnabled);
    if (reminderTime !== undefined) habit.reminderTime = reminderTime;
    if (reminderType !== undefined) habit.reminderType = reminderType;
    if (reminderCategory !== undefined) habit.reminderCategory = reminderCategory;
    if (reminderIntervalHours !== undefined) habit.reminderIntervalHours = Number(reminderIntervalHours);
    if (reminderStartHour !== undefined) habit.reminderStartHour = Number(reminderStartHour);
    if (reminderEndHour !== undefined) habit.reminderEndHour = Number(reminderEndHour);

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (error) {
    console.error('[Update Habit Error]:', error.message);
    res.status(500).json({ message: error.message || 'Error updating habit' });
  }
};

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
// @access  Private
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Ensure user owns habit
    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to delete this habit' });
    }

    await habit.deleteOne();
    res.json({ message: 'Habit successfully removed', id: req.params.id });
  } catch (error) {
    console.error('[Delete Habit Error]:', error.message);
    res.status(500).json({ message: 'Error deleting habit' });
  }
};

// @desc    Toggle completion for a specific date
// @route   POST /api/habits/:id/toggle
// @access  Private
const toggleHabitDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({ message: 'Date string (YYYY-MM-DD) is required' });
    }

    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    if (habit.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to modify this habit' });
    }

    if (!habit.skippedDates) {
      habit.skippedDates = [];
    }

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Past days are locked; only current day can be marked
    if (date < todayStr) {
      return res.status(400).json({
        message: 'Past days are locked as history and cannot be modified. Only the current day can be marked as completed or rest day.',
      });
    }

    if (date > todayStr) {
      return res.status(400).json({
        message: 'Future dates cannot be recorded in advance.',
      });
    }

    const { status } = req.body;
    const isCompleted = habit.completedDates.includes(date);
    const isSkipped = habit.skippedDates.includes(date);

    // If explicit status provided
    if (status === 'completed') {
      if (!isCompleted) habit.completedDates.push(date);
      habit.skippedDates = habit.skippedDates.filter((d) => d !== date);
    } else if (status === 'skipped') {
      if (!isSkipped) habit.skippedDates.push(date);
      habit.completedDates = habit.completedDates.filter((d) => d !== date);
    } else if (status === 'none') {
      habit.completedDates = habit.completedDates.filter((d) => d !== date);
      habit.skippedDates = habit.skippedDates.filter((d) => d !== date);
    } else {
      // 3-way toggle cycle: Unchecked -> Completed -> Skipped (Rest Day) -> Unchecked
      if (!isCompleted && !isSkipped) {
        habit.completedDates.push(date);
      } else if (isCompleted) {
        habit.completedDates = habit.completedDates.filter((d) => d !== date);
        habit.skippedDates.push(date);
      } else {
        habit.skippedDates = habit.skippedDates.filter((d) => d !== date);
      }
    }

    // Recalculate streak values preserving skipped dates
    const { currentStreak, longestStreak } = computeStreaks(
      habit.completedDates,
      habit.skippedDates
    );
    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;

    const saved = await habit.save();
    res.json({ habit: saved });
  } catch (error) {
    console.error('[Toggle Habit Error]:', error.message);
    res.status(500).json({ message: error.message || 'Error toggling habit date' });
  }
};

// @desc    Get aggregate stats
// @route   GET /api/habits/stats
// @access  Private
const getHabitStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id });
    const totalHabits = habits.length;

    let totalCheckIns = 0;
    let maxStreak = 0;

    habits.forEach((h) => {
      totalCheckIns += h.completedDates.length;
      if (h.currentStreak > maxStreak) maxStreak = h.currentStreak;
    });

    res.json({
      totalHabits,
      totalCheckIns,
      maxStreak,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error computing habit stats' });
  }
};

module.exports = {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabitDate,
  getHabitStats,
};
