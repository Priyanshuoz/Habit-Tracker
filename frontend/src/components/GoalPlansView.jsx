import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Flame,
  Scale,
  Sparkles,
  TrendingUp,
  Edit2,
  Trash2,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';
import { getLocalDateString } from '../utils/habitUtils';

const COLOR_MAP = {
  emerald: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bar: 'bg-emerald-500',
    gradient: 'from-emerald-500/20 to-teal-500/5',
    check: 'text-emerald-400',
  },
  indigo: {
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    bar: 'bg-indigo-500',
    gradient: 'from-indigo-500/20 to-purple-500/5',
    check: 'text-indigo-400',
  },
  purple: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    bar: 'bg-purple-500',
    gradient: 'from-purple-500/20 to-pink-500/5',
    check: 'text-purple-400',
  },
  rose: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    bar: 'bg-rose-500',
    gradient: 'from-rose-500/20 to-orange-500/5',
    check: 'text-rose-400',
  },
  amber: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    bar: 'bg-amber-500',
    gradient: 'from-amber-500/20 to-yellow-500/5',
    check: 'text-amber-400',
  },
  cyan: {
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    bar: 'bg-cyan-500',
    gradient: 'from-cyan-500/20 to-blue-500/5',
    check: 'text-cyan-400',
  },
};

const GoalPlansView = ({
  goals = [],
  onNewGoal,
  onEditGoal,
  onDeleteGoal,
  onToggleGoalHabit,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const todayStr = useMemo(() => getLocalDateString(new Date()), []);

  // Filter goals
  const filteredGoals = useMemo(() => {
    if (selectedCategory === 'All') return goals;
    return goals.filter((g) => g.category === selectedCategory);
  }, [goals, selectedCategory]);

  // Overall Goal Stats
  const stats = useMemo(() => {
    let totalHabitsToday = 0;
    let completedHabitsToday = 0;

    goals.forEach((g) => {
      (g.habits || []).forEach((h) => {
        totalHabitsToday++;
        if (h.completedDates && h.completedDates.includes(todayStr)) {
          completedHabitsToday++;
        }
      });
    });

    const completionRate =
      totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 0;

    return {
      totalGoals: goals.length,
      totalHabitsToday,
      completedHabitsToday,
      completionRate,
    };
  }, [goals, todayStr]);

  // Calculate past 5 days for the micro-history
  const pastDays = useMemo(() => {
    const list = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      list.push({
        dateStr: getLocalDateString(d),
        label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      });
    }
    return list;
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Active Goal Plans</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalGoals}</h3>
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Target-driven routines</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Today's Goal Habits</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">
              {stats.completedHabitsToday}{' '}
              <span className="text-sm font-normal text-slate-500">/ {stats.totalHabitsToday}</span>
            </h3>
            <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>Daily execution</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Today's Goal Success</p>
            <h3 className="text-2xl font-extrabold text-white mt-1">{stats.completionRate}%</h3>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {['All', 'Diet & Nutrition', 'Fitness & Muscle', 'Health & Wellness', 'Learning & Study'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Create Goal Plan CTA */}
        <button
          onClick={onNewGoal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal Plan (e.g. Diet)</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white">No Goal Plans Yet</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Create a separated plan (like a Diet or Fitness plan) and attach dedicated habits to it so you can monitor your progress with clarity.
            </p>
          </div>
          <button
            onClick={onNewGoal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            Create Your First Goal Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            const colorTokens = COLOR_MAP[goal.color] || COLOR_MAP.emerald;
            const habits = goal.habits || [];
            const todayCompletedCount = habits.filter(
              (h) => h.completedDates && h.completedDates.includes(todayStr)
            ).length;
            const goalProgress =
              habits.length > 0 ? Math.round((todayCompletedCount / habits.length) * 100) : 0;

            return (
              <div
                key={goal._id || goal.id}
                className="relative rounded-3xl bg-slate-900/80 border border-slate-800/90 shadow-xl overflow-hidden backdrop-blur-xl flex flex-col justify-between hover:border-slate-700/80 transition-all"
              >
                {/* Background Subtle Gradient Glow */}
                <div
                  className={`absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl ${colorTokens.gradient} pointer-events-none rounded-bl-full`}
                />

                <div className="p-6 space-y-5">
                  {/* Goal Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${colorTokens.badge}`}
                        >
                          {goal.category}
                        </span>
                        {goal.targetMetric && (
                          <span className="text-[10px] font-semibold text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
                            <Scale className="w-3 h-3 text-amber-400" />
                            {goal.targetMetric}
                          </span>
                        )}
                        {goal.targetDate && (
                          <span className="text-[10px] text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {goal.targetDate}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white tracking-tight pt-1">
                        {goal.title}
                      </h3>

                      {goal.description && (
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                          {goal.description}
                        </p>
                      )}
                    </div>

                    {/* Edit & Delete Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditGoal(goal)}
                        title="Edit Plan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteGoal(goal._id || goal.id)}
                        title="Delete Plan"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar for Today */}
                  <div className="space-y-1.5 bg-slate-950/50 p-3 rounded-2xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">Today's Plan Execution</span>
                      <span className="font-bold text-white">
                        {todayCompletedCount} / {habits.length} ({goalProgress}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorTokens.bar} rounded-full transition-all duration-300`}
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Specific Habits Checklist */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Goal Habits Checklist:
                    </span>

                    <div className="space-y-2">
                      {habits.map((habit) => {
                        const isDoneToday =
                          habit.completedDates && habit.completedDates.includes(todayStr);

                        return (
                          <div
                            key={habit.id || habit._id}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              isDoneToday
                                ? 'bg-slate-950/90 border-slate-800'
                                : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700'
                            }`}
                          >
                            {/* Toggle Checkbox Button */}
                            <button
                              type="button"
                              onClick={() =>
                                onToggleGoalHabit(goal._id || goal.id, habit.id || habit._id, todayStr)
                              }
                              className="flex items-center gap-3 text-left flex-1 cursor-pointer group"
                            >
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                                  isDoneToday
                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                                    : 'border border-slate-700 text-transparent group-hover:border-emerald-500'
                                }`}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </div>

                              <span
                                className={`text-xs font-semibold transition-colors ${
                                  isDoneToday
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-200 group-hover:text-white'
                                }`}
                              >
                                {habit.title}
                              </span>
                            </button>

                            {/* 5-Day Micro History */}
                            <div className="flex items-center gap-1 shrink-0">
                              {pastDays.map((d) => {
                                const isDone =
                                  habit.completedDates && habit.completedDates.includes(d.dateStr);
                                return (
                                  <div
                                    key={d.dateStr}
                                    title={`${d.dateStr}: ${isDone ? 'Completed' : 'Not completed'}`}
                                    className={`w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-bold ${
                                      isDone
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : 'bg-slate-800/50 text-slate-600'
                                    }`}
                                  >
                                    {d.label}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer badge */}
                <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dedicated Goal Monitor</span>
                  </span>
                  <span>{habits.length} habits configured</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default GoalPlansView;
