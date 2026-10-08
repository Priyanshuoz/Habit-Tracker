import React, { useMemo, useState } from 'react';
import {
  X,
  Flame,
  CheckCircle2,
  Pause,
  AlertCircle,
  Calendar,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import {
  calculateStreak,
  getLocalDateString,
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
} from '../utils/habitUtils';

const HabitDetailModal = ({ isOpen, onClose, habit, todayStr }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'completed' | 'skipped' | 'missed'

  // Breakdown of dates from creation to today
  const details = useMemo(() => {
    if (!habit) return null;

    const completedSet = new Set(
      (habit.completedDates || []).map((d) =>
        typeof d === 'string' ? d.split('T')[0] : d?.date?.split('T')[0] || ''
      )
    );

    const skippedSet = new Set(
      (habit.skippedDates || []).map((d) =>
        typeof d === 'string' ? d.split('T')[0] : d?.date?.split('T')[0] || ''
      )
    );

    const createdDate = habit.createdAt ? new Date(habit.createdAt) : new Date();
    const createdStr = getLocalDateString(createdDate);

    // Generate date sequence from createdStr to todayStr
    const daysHistory = [];
    const cursor = new Date(createdDate);
    cursor.setHours(0, 0, 0, 0);

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    let daysCount = 0;
    while (cursor <= todayDate && daysCount < 365) {
      const dStr = getLocalDateString(cursor);
      const isToday = dStr === todayStr;
      const isCompleted = completedSet.has(dStr);
      const isSkipped = skippedSet.has(dStr);
      const isMissed = !isToday && !isCompleted && !isSkipped;

      daysHistory.push({
        dateStr: dStr,
        displayDate: cursor.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        isToday,
        isCompleted,
        isSkipped,
        isMissed,
        status: isCompleted
          ? 'completed'
          : isSkipped
          ? 'skipped'
          : isMissed
          ? 'missed'
          : 'pending',
      });

      cursor.setDate(cursor.getDate() + 1);
      daysCount += 1;
    }

    // Reverse to show most recent first
    daysHistory.reverse();

    const completedCount = completedSet.size;
    const skippedCount = skippedSet.size;
    const missedCount = daysHistory.filter((d) => d.isMissed).length;
    const totalTrackedDays = daysHistory.length;

    const streak = calculateStreak(habit.completedDates, habit.skippedDates);

    // Data for Recharts Pie
    const pieData = [
      { name: 'Completed Days', value: completedCount, color: '#10b981' }, // Emerald
      { name: 'Rest / Skipped Days', value: skippedCount, color: '#0ea5e9' }, // Sky
      { name: 'Missed Days', value: missedCount, color: '#f43f5e' }, // Rose
    ].filter((item) => item.value > 0);

    // If completely empty (e.g. brand new habit today with 0 records yet)
    if (pieData.length === 0) {
      pieData.push({ name: 'Pending Today', value: 1, color: '#6366f1' });
    }

    const adherenceRate =
      totalTrackedDays > 0
        ? Math.round(((completedCount + skippedCount) / totalTrackedDays) * 100)
        : 100;

    return {
      daysHistory,
      completedCount,
      skippedCount,
      missedCount,
      totalTrackedDays,
      streak,
      pieData,
      adherenceRate,
      createdStr,
    };
  }, [habit, todayStr]);

  if (!isOpen || !habit || !details) return null;

  const categoryStyle =
    CATEGORY_COLORS[habit.category] || DEFAULT_CATEGORY_COLOR;

  // Filter history list based on tab
  const filteredHistory = details.daysHistory.filter((day) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return day.isCompleted;
    if (activeTab === 'skipped') return day.isSkipped;
    if (activeTab === 'missed') return day.isMissed;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <h2 className="text-xl font-bold text-white">{habit.title}</h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
              >
                {habit.category || 'General'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
                {habit.frequency || 'daily'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Created on {details.createdStr} • Detailed Routine Analytics
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto space-y-6 pt-4 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </div>
              <p className="text-2xl font-extrabold text-white">
                {details.completedCount}
              </p>
              <p className="text-[10px] text-slate-500">Days accomplished</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-sky-400 font-medium mb-1">
                <Pause className="w-3.5 h-3.5" />
                <span>Rest Days</span>
              </div>
              <p className="text-2xl font-extrabold text-white">
                {details.skippedCount}
              </p>
              <p className="text-[10px] text-slate-500">Protected streaks</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Missed</span>
              </div>
              <p className="text-2xl font-extrabold text-white">
                {details.missedCount}
              </p>
              <p className="text-[10px] text-slate-500">Uncompleted days</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs text-orange-400 font-medium mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Active Streak</span>
              </div>
              <p className="text-2xl font-extrabold text-white">
                {details.streak.current}
              </p>
              <p className="text-[10px] text-slate-500">
                Best: {details.streak.longest}d
              </p>
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-indigo-400" />
                <span>Distribution Breakdown</span>
              </h3>
              <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {details.adherenceRate}% Adherence
              </div>
            </div>

            <div className="w-full h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={details.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {details.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                    }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* History Log with Tabs */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Day-by-Day History</span>
              </h3>

              {/* Tab Pills */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({details.daysHistory.length})
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'completed'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Done ({details.completedCount})
                </button>
                <button
                  onClick={() => setActiveTab('skipped')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'skipped'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Rest ({details.skippedCount})
                </button>
                <button
                  onClick={() => setActiveTab('missed')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'missed'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Missed ({details.missedCount})
                </button>
              </div>
            </div>

            {/* List of days */}
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-500">
                  No days found under this filter.
                </div>
              ) : (
                filteredHistory.map((day) => (
                  <div
                    key={day.dateStr}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/50 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                          day.isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : day.isSkipped
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : day.isMissed
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        {day.isCompleted ? (
                          '✓'
                        ) : day.isSkipped ? (
                          '⏸'
                        ) : day.isMissed ? (
                          '✕'
                        ) : (
                          '•'
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200">
                          {day.displayDate}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {day.isToday ? 'Today (Active)' : day.dateStr}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        day.isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : day.isSkipped
                          ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                          : day.isMissed
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {day.isCompleted
                        ? 'Completed'
                        : day.isSkipped
                        ? 'Rest / Skipped'
                        : day.isMissed
                        ? 'Missed Workout'
                        : 'Pending Today'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetailModal;
