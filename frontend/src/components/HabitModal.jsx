import React, { useState, useEffect } from 'react';
import { Sparkles, X, AlertCircle, RefreshCw, Bell, Clock } from 'lucide-react';
import {
  requestNotificationPermission,
  sendDesktopNotification,
} from '../utils/notificationUtils';

export const HABIT_TEMPLATES = [
  {
    id: 'tmpl_water',
    title: 'Drink 3 Liters of Water',
    description: 'Keep a water bottle nearby and stay thoroughly hydrated across the day.',
    category: 'Health',
    frequency: 'daily',
    color: 'cyan',
    targetDays: 7,
    reminderEnabled: true,
    reminderTime: '09:00',
    icon: '💧',
  },
  {
    id: 'tmpl_workout',
    title: '30 Min Morning Workout',
    description: 'Calisthenics, gym session, or brisk jog to elevate daily energy levels.',
    category: 'Fitness',
    frequency: 'daily',
    color: 'emerald',
    targetDays: 6,
    reminderEnabled: true,
    reminderTime: '07:30',
    icon: '🏃',
  },
  {
    id: 'tmpl_reading',
    title: 'Read 15 Pages of a Book',
    description: 'Dedicated offline reading to sharpen focus and expand knowledge.',
    category: 'Learning',
    frequency: 'daily',
    color: 'indigo',
    targetDays: 7,
    reminderEnabled: true,
    reminderTime: '21:30',
    icon: '📖',
  },
  {
    id: 'tmpl_meditation',
    title: '10 Min Evening Meditation',
    description: 'Breathwork, calm reflection, and mental reset before sleep.',
    category: 'Mindfulness',
    frequency: 'daily',
    color: 'purple',
    targetDays: 7,
    reminderEnabled: true,
    reminderTime: '22:00',
    icon: '🧘',
  },
];

const HabitModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
  formError,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Productivity',
    frequency: 'daily',
    color: 'indigo',
    targetDays: 7,
    reminderEnabled: false,
    reminderTime: '09:00',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || 'Productivity',
        frequency: initialData.frequency || 'daily',
        color: initialData.color || 'indigo',
        targetDays: initialData.targetDays || 7,
        reminderEnabled: Boolean(initialData.reminderEnabled),
        reminderTime: initialData.reminderTime || '09:00',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Productivity',
        frequency: 'daily',
        color: 'indigo',
        targetDays: 7,
        reminderEnabled: false,
        reminderTime: '09:00',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {initialData ? 'Edit Habit' : 'Create New Habit'}
              </h3>
              <p className="text-xs text-slate-400">
                Set up your routine for maximum consistency
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error banner in modal */}
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Starter Habit Templates (only for new habits) */}
          {!initialData && (
            <div className="space-y-2 pb-1">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Or pick a starter template:</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {HABIT_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        title: tmpl.title,
                        description: tmpl.description,
                        category: tmpl.category,
                        frequency: tmpl.frequency,
                        color: tmpl.color,
                        targetDays: tmpl.targetDays,
                        reminderEnabled: tmpl.reminderEnabled,
                        reminderTime: tmpl.reminderTime,
                      });
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer group flex items-start gap-2.5 ${
                      formData.title === tmpl.title
                        ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <span className="text-lg shrink-0 mt-0.5">{tmpl.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                        {tmpl.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {tmpl.category} • {tmpl.targetDays}d/wk
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Habit Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Morning 20m Meditation"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Motivation
            </label>
            <textarea
              placeholder="e.g. Focus on deep breathing and mindfulness before starting work."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Category & Frequency Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Productivity">Productivity</option>
                <option value="Fitness">Fitness</option>
                <option value="Mindfulness">Mindfulness</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Frequency
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          {/* Daily Reminder Settings Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    formData.reminderEnabled
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-200 block">
                    Daily Task Reminder
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Get desktop and in-app notifications at your set time
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={async () => {
                  const nextVal = !formData.reminderEnabled;
                  setFormData((prev) => ({ ...prev, reminderEnabled: nextVal }));
                  if (nextVal) {
                    await requestNotificationPermission();
                  }
                }}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  formData.reminderEnabled
                    ? 'bg-indigo-600 justify-end'
                    : 'bg-slate-800 justify-start'
                }`}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            {/* Time Picker & Test Alert (Shown when enabled) */}
            {formData.reminderEnabled && (
              <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    Reminder Time:
                  </span>
                  <input
                    type="time"
                    value={formData.reminderTime || '09:00'}
                    onChange={(e) =>
                      setFormData({ ...formData, reminderTime: e.target.value })
                    }
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await requestNotificationPermission();
                    sendDesktopNotification(
                      `Reminder: ${formData.title || 'Your Habit'}`,
                      {
                        body: `Scheduled for ${formData.reminderTime || '09:00'}. Notification test successful!`,
                      }
                    );
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Bell className="w-3 h-3" />
                  <span>Test Alert</span>
                </button>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{initialData ? 'Update Habit' : 'Create Habit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
