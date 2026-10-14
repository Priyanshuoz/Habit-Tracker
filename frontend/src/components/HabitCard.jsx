import { useState } from 'react';
import { CheckCircle2, Circle, Trash2, Flame, Pencil, Check, X, Calendar } from 'lucide-react';
import HabitCalendar from './HabitCalendar';

const CATEGORY_STYLES = {
    General: 'bg-gray-700/50 text-gray-300 border-gray-600',
    Fitness: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
    Study: 'bg-blue-950/40 text-blue-400 border-blue-500/30',
    Health: 'bg-rose-950/40 text-rose-400 border-rose-500/30',
    Mindset: 'bg-purple-950/40 text-purple-400 border-purple-500/30',
    Productivity: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
};

const CATEGORIES = ['General', 'Fitness', 'Study', 'Health', 'Mindset', 'Productivity'];

const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push({
            dateString: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
            dayNumber: d.getDate(),
        });
    }
    return days;
};

const HabitCard = ({ habit, today, onToggle, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [editTitle, setEditTitle] = useState(habit.title);
    const [editCategory, setEditCategory] = useState(habit.category || 'General');

    const isDoneToday = habit.completedDates?.includes(today);
    const last7Days = getLast7Days();

    const handleSave = () => {
        if (!editTitle.trim()) return;
        if (onUpdate) {
            onUpdate(habit._id, { title: editTitle.trim(), category: editCategory });
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditTitle(habit.title);
        setEditCategory(habit.category || 'General');
        setIsEditing(false);
    };

    return (
        <div
            className={`bg-gray-900 border rounded-2xl p-4 sm:p-5 transition-all duration-200 ${isDoneToday
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
        >
            <div className="flex items-center justify-between gap-3">
                {isEditing ? (
                    /* Inline Editing Mode */
                    <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Habit title..."
                            autoFocus
                        />
                        <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="bg-gray-800 border border-gray-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <div className="flex items-center gap-1 self-end sm:self-auto">
                            <button
                                onClick={handleSave}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition cursor-pointer"
                                title="Save changes"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleCancel}
                                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition cursor-pointer"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Normal Display Mode */
                    <>
                        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                            {/* 1. Toggle Checkmark Button */}
                            <button
                                onClick={() => onToggle(habit._id, today)}
                                className="focus:outline-none transition transform active:scale-90 cursor-pointer shrink-0"
                                title={isDoneToday ? 'Mark incomplete' : 'Mark complete'}
                            >
                                {isDoneToday ? (
                                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                                ) : (
                                    <Circle className="w-6 h-6 text-gray-600 hover:text-indigo-400" />
                                )}
                            </button>

                            {/* 2. Habit Title & Badges */}
                            <div className="min-w-0 flex-1">
                                <p
                                    className={`text-sm font-medium transition ${isDoneToday
                                            ? 'line-through text-gray-500'
                                            : 'text-gray-100'
                                        }`}
                                >
                                    {habit.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    {/* Category Badge */}
                                    <span
                                        className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.General
                                            }`}
                                    >
                                        {habit.category}
                                    </span>

                                    {/* Streak Badge */}
                                    <span className="flex items-center text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                        <Flame className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                                        {habit.currentStreak || 0} streak
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons: Calendar, Edit & Delete */}
                        <div className="flex items-center space-x-1 shrink-0">
                            <button
                                onClick={() => setShowCalendar(!showCalendar)}
                                className={`p-2 rounded-lg transition cursor-pointer ${
                                    showCalendar
                                        ? 'text-indigo-400 bg-indigo-500/10'
                                        : 'text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10'
                                }`}
                                title={showCalendar ? 'Hide monthly history' : 'View monthly history'}
                            >
                                <Calendar className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="text-gray-500 hover:text-indigo-400 p-2 hover:bg-indigo-500/10 rounded-lg transition cursor-pointer"
                                title="Edit habit"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onDelete(habit._id)}
                                className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                                title="Delete habit"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Monthly Calendar View (Expandable) */}
            {showCalendar && (
                <HabitCalendar
                    habit={habit}
                    today={today}
                    onToggle={onToggle}
                />
            )}

            {/* 7-Day Mini-Streak Dots (Read-only History) */}
            <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between sm:justify-end sm:gap-3">
                <span className="text-[11px] text-gray-500 font-medium mr-2">Last 7 Days:</span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {last7Days.map((day) => {
                        const isCompletedOnDay = habit.completedDates?.includes(day.dateString);
                        const isToday = day.dateString === today;

                        return (
                            <div
                                key={day.dateString}
                                title={`${day.dateString}: ${isCompletedOnDay ? 'Completed' : 'Not completed'}${isToday ? ' (Today)' : ''}`}
                                className={`flex flex-col items-center justify-center w-7 h-9 rounded-lg text-[10px] font-medium select-none ${isCompletedOnDay
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                        : isToday
                                            ? 'bg-gray-800 text-gray-300 border border-indigo-500/50'
                                            : 'bg-gray-800/30 text-gray-600 border border-gray-800'
                                    }`}
                            >
                                <span className="text-[9px] uppercase">{day.dayName}</span>
                                <span className="font-bold">{day.dayNumber}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HabitCard;
