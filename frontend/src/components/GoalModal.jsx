import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  Utensils,
  Dumbbell,
  Heart,
  BookOpen,
  Briefcase,
  Flame,
} from 'lucide-react';

const CATEGORIES = [
  'Diet & Nutrition',
  'Fitness & Muscle',
  'Health & Wellness',
  'Learning & Study',
  'Productivity',
  'Personal Growth',
  'Other',
];

const COLORS = [
  { name: 'emerald', bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500' },
  { name: 'indigo', bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500' },
  { name: 'purple', bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500' },
  { name: 'rose', bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500' },
  { name: 'amber', bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500' },
  { name: 'cyan', bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500' },
];

const TEMPLATES = [
  {
    title: 'Strict Ketogenic & Fat Loss Diet',
    category: 'Diet & Nutrition',
    color: 'emerald',
    targetMetric: 'Target: 70kg / < 20g Carbs',
    habits: [
      'Drink 3.5 Liters of Water',
      'Keep Net Carbs Under 25g',
      '16/8 Intermittent Fasting Window',
      'Track All Macros in Diary',
    ],
  },
  {
    title: 'High Protein Muscle Hypertrophy',
    category: 'Fitness & Muscle',
    color: 'indigo',
    targetMetric: 'Target: 160g Protein / 5x Gym',
    habits: [
      'Hit 160g Daily Protein',
      'Pre-workout Creatine & Hydration',
      'Log Resistance Weights & Reps',
      '8 Hours Sleep for Recovery',
    ],
  },
  {
    title: 'Daily Mindfulness & Clean Health',
    category: 'Health & Wellness',
    color: 'purple',
    targetMetric: '30 Days Unbroken Streak',
    habits: [
      '15 Min Morning Sunlight Walk',
      'Zero Refined Sugars & Sodas',
      '10 Min Meditation Before Sleep',
    ],
  },
];

const GoalModal = ({ isOpen, onClose, onSave, editingGoal = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Diet & Nutrition');
  const [color, setColor] = useState('emerald');
  const [targetDate, setTargetDate] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [habits, setHabits] = useState([]);
  const [newHabitInput, setNewHabitInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title || '');
      setDescription(editingGoal.description || '');
      setCategory(editingGoal.category || 'Diet & Nutrition');
      setColor(editingGoal.color || 'emerald');
      setTargetDate(editingGoal.targetDate || '');
      setTargetMetric(editingGoal.targetMetric || '');
      setHabits(editingGoal.habits || []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Diet & Nutrition');
      setColor('emerald');
      setTargetDate('');
      setTargetMetric('');
      setHabits([
        { id: 'h_1', title: 'Drink 3L of Water', frequency: 'daily', completedDates: [] },
        { id: 'h_2', title: 'Zero Refined Sugar', frequency: 'daily', completedDates: [] },
      ]);
    }
    setError('');
  }, [editingGoal, isOpen]);

  const handleAddHabit = () => {
    if (!newHabitInput.trim()) return;
    setHabits((prev) => [
      ...prev,
      {
        id: `gh_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: newHabitInput.trim(),
        frequency: 'daily',
        completedDates: [],
      },
    ]);
    setNewHabitInput('');
  };

  const handleRemoveHabit = (index) => {
    setHabits((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApplyTemplate = (template) => {
    setTitle(template.title);
    setCategory(template.category);
    setColor(template.color);
    setTargetMetric(template.targetMetric);
    setHabits(
      template.habits.map((h, i) => ({
        id: `gh_${Date.now()}_${i}`,
        title: h,
        frequency: 'daily',
        completedDates: [],
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a goal plan title');
      return;
    }
    if (habits.length === 0) {
      setError('Please add at least one specific habit to achieve this goal');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        category,
        color,
        targetDate,
        targetMetric: targetMetric.trim(),
        habits,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error saving goal plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {editingGoal ? 'Edit Goal Plan' : 'Create Dedicated Goal Plan'}
              </h3>
              <p className="text-xs text-slate-400">
                Define a separated goal (like a Diet Plan) and link habits to monitor it properly.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 custom-scrollbar">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Quick Starter Templates (only when creating new) */}
          {!editingGoal && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Starter Templates:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-semibold text-white group-hover:text-emerald-400 truncate">
                      {tmpl.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{tmpl.category}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Goal Plan Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ketogenic Diet Plan, Half-Marathon Training, 30-Day Lean Bulk"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Theme Color</label>
              <div className="flex items-center gap-2 pt-1">
                {COLORS.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setColor(col.name)}
                    className={`w-7 h-7 rounded-lg ${col.bg} transition-all cursor-pointer ${
                      color === col.name ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Target Metric & Target Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Metric / Objective
              </label>
              <input
                type="text"
                placeholder="e.g. Under 2,100 kcal, 72 kg, 15% Body Fat"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Deadline (Optional)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Description / Diet Strategy */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Plan Strategy & Notes (Optional)
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Focus on eliminating processed sugars and eating healthy fats. Meals: Eggs, Avocado, Salmon, Spinach."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Goal-Specific Habits Section */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Specific Habits to Achieve this Goal</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Track these routine actions every day to reach your target.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {habits.length} {habits.length === 1 ? 'Habit' : 'Habits'}
              </span>
            </div>

            {/* List of current habits */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {habits.map((h, i) => (
                <div
                  key={h.id || i}
                  className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      {i + 1}
                    </span>
                    <span className="text-slate-200 font-medium">{h.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHabit(i)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new habit input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add sub-habit (e.g. 'No snacking after 8 PM', 'Drink 3L water')"
                value={newHabitInput}
                onChange={(e) => setNewHabitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddHabit();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddHabit}
                className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving...' : editingGoal ? 'Update Goal Plan' : 'Create Goal Plan'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default GoalModal;
