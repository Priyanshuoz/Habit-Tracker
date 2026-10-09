const mongoose = require('mongoose');

const subHabitSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a habit title for the goal'],
    trim: true,
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly'],
    default: 'daily',
  },
  targetDays: {
    type: Number,
    default: 7,
  },
  completedDates: {
    type: [String],
    default: [],
  },
});

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a goal title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: [
        'Diet & Nutrition',
        'Fitness & Muscle',
        'Health & Wellness',
        'Learning & Study',
        'Productivity',
        'Personal Growth',
        'Other',
      ],
      default: 'Diet & Nutrition',
    },
    color: {
      type: String,
      default: 'emerald',
    },
    targetDate: {
      type: String,
      default: '',
    },
    targetMetric: {
      type: String,
      default: '', // e.g. "Reach 72 kg", "15% body fat", "2200 kcal/day"
    },
    habits: {
      type: [subHabitSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    reminderType: {
      type: String,
      enum: ['daily', 'interval'],
      default: 'interval',
    },
    reminderCategory: {
      type: String,
      enum: ['custom', 'hydration', 'walk'],
      default: 'hydration',
    },
    reminderTime: {
      type: String,
      default: '09:00',
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

goalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Goal', goalSchema);
