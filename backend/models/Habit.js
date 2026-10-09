const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a habit title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    category: {
      type: String,
      enum: ['Fitness', 'Productivity', 'Mindfulness', 'Health', 'Learning', 'Other'],
      default: 'Productivity',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    color: {
      type: String,
      default: 'indigo',
    },
    targetDays: {
      type: Number,
      default: 7,
      min: 1,
      max: 7,
    },
    completedDates: {
      type: [String],
      default: [],
    },
    skippedDates: {
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
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    reminderTime: {
      type: String,
      default: '',
    },
    reminderType: {
      type: String,
      enum: ['daily', 'interval'],
      default: 'daily',
    },
    reminderCategory: {
      type: String,
      enum: ['custom', 'hydration', 'walk'],
      default: 'custom',
    },
    reminderIntervalHours: {
      type: Number,
      default: 2,
    },
    reminderStartHour: {
      type: Number,
      default: 8,
    },
    reminderEndHour: {
      type: Number,
      default: 21,
    },
  },
  {
    timestamps: true,
  }
);

// Index user and createdAt for fast queries
habitSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Habit', habitSchema);
