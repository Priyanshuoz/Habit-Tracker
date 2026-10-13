const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    //Link habit to the logged-in User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please enter a habit title'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Fitness', 'Study', 'Health', 'Mindset', 'Productivity'],
    },
    completedDates: {
      type: [String],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
