import React, { useState, useEffect } from 'react';
import { Sparkles, X, AlertCircle, RefreshCw, Bell, Clock, Droplets, Footprints } from 'lucide-react';
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
    reminderType: 'interval',
    reminderCategory: 'hydration',
    reminderIntervalHours: 2,
    reminderTime: '09:00',
    icon: '💧',
  },
  {
    id: 'tmpl_walk',
    title: 'Hourly Walking & Posture Break',
    description: 'Step away from the screen for 5 minutes and take 250 steps every hour.',
    category: 'Health',
    frequency: 'daily',
    color: 'emerald',
    targetDays: 7,
    reminderEnabled: true,
    reminderType: 'interval',
    reminderCategory: 'walk',
    reminderIntervalHours: 1,
    reminderTime: '10:00',
    icon: '🚶',
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
    reminderType: 'daily',
    reminderCategory: 'custom',
    reminderIntervalHours: 2,
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
    reminderType: 'daily',
    reminderCategory: 'custom',
    reminderIntervalHours: 2,
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
    reminderType: 'daily',
    reminderCategory: 'custom',
    reminderIntervalHours: 2,
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
    reminderType: 'daily',
    reminderCategory: 'custom',
    reminderIntervalHours: 2,
    reminderStartHour: 8,
    reminderEndHour: 21,
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
        reminderType: initialData.reminderType || 'daily',
        reminderCategory: initialData.reminderCategory || 'custom',
        reminderIntervalHours: Number(initialData.reminderIntervalHours) || 2,
        reminderStartHour: Number(initialData.reminderStartHour) || 8,
        reminderEndHour: Number(initialData.reminderEndHour) || 21,
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
        reminderType: 'daily',
        reminderCategory: 'custom',
        reminderIntervalHours: 2,
        reminderStartHour: 8,
        reminderEndHour: 21,
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
                        reminderType: tmpl.reminderType || 'daily',
                        reminderCategory: tmpl.reminderCategory || 'custom',
                        reminderIntervalHours: tmpl.reminderIntervalHours || 2,
                        reminderStartHour: 8,
                        reminderEndHour: 21,
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

          {/* Daily & Interval Reminder Settings Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    formData.reminderEnabled
                      ? formData.reminderCategory === 'hydration'
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : formData.reminderCategory === 'walk'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {formData.reminderCategory === 'hydration' ? (
                    <Droplets className="w-4 h-4" />
                  ) : formData.reminderCategory === 'walk' ? (
                    <Footprints className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-200 block">
                    Task Reminder & Recurring Nudges
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Hydration, walk breaks, or specific scheduled times
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

            {/* Reminder Details (Shown when enabled) */}
            {formData.reminderEnabled && (
              <div className="pt-2 border-t border-slate-800/80 space-y-3 animate-in fade-in duration-200">
                {/* Style & Preset Buttons */}
                <div>
                  <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
                    Reminder Style:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          reminderCategory: 'hydration',
                          reminderType: 'interval',
                          reminderIntervalHours: 2,
                        }))
                      }
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.reminderCategory === 'hydration'
                          ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Hydration Nudge</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Every 1-2 hours</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          reminderCategory: 'walk',
                          reminderType: 'interval',
                          reminderIntervalHours: 1,
                        }))
                      }
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.reminderCategory === 'walk'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Walk / Steps</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Every 1 hour</p>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          reminderCategory: 'custom',
                          reminderType: 'daily',
                        }))
                      }
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.reminderCategory === 'custom'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Fixed Time</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">Daily alarm</p>
                    </button>
                  </div>
                </div>

                {/* Sub-controls based on Type */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  {formData.reminderType === 'interval' ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-slate-300 font-medium">Frequency:</span>
                      <select
                        value={formData.reminderIntervalHours || 2}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            reminderIntervalHours: Number(e.target.value),
                          })
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      >
                        <option value={1}>Every 1 Hour (Intensive)</option>
                        <option value={1.5}>Every 1.5 Hours</option>
                        <option value={2}>Every 2 Hours (Recommended)</option>
                        <option value={3}>Every 3 Hours</option>
                        <option value={4}>Every 4 Hours</option>
                      </select>
                      <span className="text-[11px] text-slate-500">During active daytime</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-300 font-medium">Time:</span>
                      <input
                        type="time"
                        value={formData.reminderTime || '09:00'}
                        onChange={(e) =>
                          setFormData({ ...formData, reminderTime: e.target.value })
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={async () => {
                      await requestNotificationPermission();
                      const nudgeTitle =
                        formData.reminderCategory === 'hydration'
                          ? '💧 Hydration Nudge: Drink Water!'
                          : formData.reminderCategory === 'walk'
                          ? '🚶 Walk Break: Time to Move!'
                          : `Reminder: ${formData.title || 'Your Habit'}`;
                      const nudgeBody =
                        formData.reminderCategory === 'hydration'
                          ? 'Drink a glass of water (250ml) to hit your daily hydration target.'
                          : formData.reminderCategory === 'walk'
                          ? 'Stand up, stretch and take a 5-minute walk (250 steps)!'
                          : `Scheduled check-in for ${formData.title || 'habit'}.`;

                      sendDesktopNotification(nudgeTitle, { body: nudgeBody });
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all cursor-pointer self-start sm:self-auto"
                  >
                    <Bell className="w-3 h-3" />
                    <span>Test Nudge Alert</span>
                  </button>
                </div>
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
