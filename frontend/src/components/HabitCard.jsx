import React from 'react';
import {
  Flame,
  CheckCircle2,
  Circle,
  Pause,
  Edit3,
  Trash2,
  PieChart,
} from 'lucide-react';
import {
  calculateStreak,
  isDateCompleted,
  isDateSkipped,
  isDateMissed,
  isDateBeforeCreation,
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
} from '../utils/habitUtils';

const HabitCard = ({
  habit,
  past7Days,
  todayStr,
  onToggleDate,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const habitId = habit._id || habit.id;
  const streak = calculateStreak(habit.completedDates, habit.skippedDates);
  const isCompletedToday = isDateCompleted(habit, todayStr);
  const isSkippedToday = isDateSkipped(habit, todayStr);
  const categoryStyle =
    CATEGORY_COLORS[habit.category] || DEFAULT_CATEGORY_COLOR;

  return (
    <div
      className={`p-5 rounded-2xl bg-slate-900/60 border backdrop-blur-xl transition-all duration-200 hover:border-slate-700/80 ${
        isCompletedToday
          ? 'border-emerald-500/30 bg-slate-900/80'
          : isSkippedToday
          ? 'border-sky-500/30 bg-slate-900/80'
          : 'border-slate-800/80'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Quick Today Status Button, Title, Category, Streaks */}
        <div className="flex items-start gap-4 flex-1">
          {/* 3-State Action Button for Today (Completed -> Skipped -> Unchecked) */}
          <button
            onClick={() => onToggleDate(habit, todayStr)}
            title={
              isCompletedToday
                ? 'Completed today! Click to mark as Skipped (Rest day - streak protected)'
                : isSkippedToday
                ? 'Skipped today (streak protected). Click to reset to Unchecked'
                : 'Unchecked today. Click to mark as Completed'
            }
            className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              isCompletedToday
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-105'
                : isSkippedToday
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-lg shadow-sky-500/20 scale-105'
                : 'bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700/80 border border-slate-700'
            }`}
          >
            {isCompletedToday ? (
              <CheckCircle2 className="w-5 h-5 fill-white text-emerald-500" />
            ) : isSkippedToday ? (
              <Pause className="w-4 h-4 fill-sky-400 text-sky-400" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <div
            onClick={() => onViewDetails && onViewDetails(habit)}
            className="cursor-pointer group/title flex-1"
            title="Click to view routine analytics and rest days"
          >
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3
                className={`text-base font-bold transition-colors group-hover/title:text-indigo-300 ${
                  isCompletedToday ? 'text-emerald-300' : 'text-white'
                }`}
              >
                {habit.title}
              </h3>

              {/* Category Pill */}
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${categoryStyle.bg} ${categoryStyle.text} ${categoryStyle.border}`}
              >
                {habit.category || 'General'}
              </span>

              {/* Frequency Pill */}
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
                {habit.frequency || 'daily'}
              </span>

              {/* Rest Day / Skipped Badge */}
              {isSkippedToday && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/25 flex items-center gap-1 font-medium">
                  <Pause className="w-3 h-3" /> Rest Day
                </span>
              )}
            </div>

            {habit.description && (
              <p className="text-xs text-slate-400 max-w-xl line-clamp-2">
                {habit.description}
              </p>
            )}

            {/* Streaks stats info */}
            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 font-semibold text-orange-400">
                <Flame className="w-3.5 h-3.5 fill-orange-400/20" />
                <span>{streak.current} day streak</span>
              </div>
              <span className="text-slate-700">•</span>
              <div className="text-slate-400">
                Best: <span className="text-slate-300 font-semibold">{streak.longest} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: 7-Day Matrix + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/80">
          {/* 7-Day Mini Checklist */}
          <div className="flex items-center gap-1.5">
            {past7Days.map((day) => {
              const isToday = day.isToday;
              const isDone = isDateCompleted(habit, day.dateStr);
              const isSkipped = isDateSkipped(habit, day.dateStr);
              const isMissed = isDateMissed(habit, day.dateStr, todayStr);
              const isBeforeCreation = isDateBeforeCreation(habit, day.dateStr);

              // Today: Fully interactive to mark Completed or Rest Day
              if (isToday) {
                return (
                  <button
                    key={day.dateStr}
                    onClick={() => onToggleDate(habit, day.dateStr)}
                    title={
                      isDone
                        ? 'Today: Completed! Click to mark as Rest Day (streak protected)'
                        : isSkipped
                        ? 'Today: Rest Day (streak protected). Click to reset'
                        : 'Today: Click to mark Completed'
                    }
                    className={`flex flex-col items-center justify-center w-8 h-11 rounded-lg text-[10px] transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-400/40 shadow-sm shadow-emerald-500/20'
                        : isSkipped
                        ? 'bg-sky-500/20 border border-sky-400/40 text-sky-300 font-bold ring-2 ring-sky-400/30 shadow-sm shadow-sky-500/20'
                        : 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 font-semibold shadow-sm'
                    }`}
                  >
                    <span className="opacity-75">{day.dayName.charAt(0)}</span>
                    <span className="font-bold text-xs">
                      {isSkipped ? '⏸' : isDone ? '✓' : day.dayNumber}
                    </span>
                  </button>
                );
              }

              // Past Days: Locked as view-only historical record
              return (
                <div
                  key={day.dateStr}
                  title={
                    isDone
                      ? `${day.dayName} (${day.dateStr}): Completed`
                      : isSkipped
                      ? `${day.dayName} (${day.dateStr}): Rest Day (Protected)`
                      : isMissed
                      ? `${day.dayName} (${day.dateStr}): Missed Workout`
                      : `${day.dayName} (${day.dateStr}): Before habit was created`
                  }
                  className={`flex flex-col items-center justify-center w-8 h-11 rounded-lg text-[10px] select-none cursor-default ${
                    isDone
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold'
                      : isSkipped
                      ? 'bg-sky-500/20 border border-sky-400/30 text-sky-300 font-bold'
                      : isMissed
                      ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold ring-1 ring-rose-500/30 shadow-sm shadow-rose-500/10'
                      : isBeforeCreation
                      ? 'bg-slate-900/30 border border-slate-800/30 text-slate-700'
                      : 'bg-slate-900/40 border border-slate-800/40 text-slate-600'
                  }`}
                >
                  <span className="opacity-60">{day.dayName.charAt(0)}</span>
                  <span className="font-bold text-xs">
                    {isDone ? '✓' : isSkipped ? '⏸' : isMissed ? '✕' : '-'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Analytics, Edit, and Delete Actions */}
          <div className="flex items-center gap-1 pl-2 border-l border-slate-800/80">
            <button
              onClick={() => onViewDetails && onViewDetails(habit)}
              title="View routine pie chart analytics & rest days"
              className="p-2 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <PieChart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(habit)}
              title="Edit habit"
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(habitId)}
              title="Delete habit"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
