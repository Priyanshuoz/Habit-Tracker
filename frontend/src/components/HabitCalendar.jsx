import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const HabitCalendar = ({ habit, today, onToggle }) => {
    // Current viewed month date (starts at current month)
    const [viewDate, setViewDate] = useState(() => new Date());

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); 

    // Navigate months
    const handlePrevMonth = () => {
        setViewDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setViewDate(new Date(year, month + 1, 1));
    };

    const handleCurrentMonth = () => {
        setViewDate(new Date());
    };

    // Calculate calendar grid for viewed month
    const { days, completedCount, totalDaysInMonth, percentCompleted } = useMemo(() => {
        const firstDayIndex = new Date(year, month, 1).getDay(); 
        const totalDays = new Date(year, month + 1, 0).getDate(); 

        const daysArray = [];
        let completed = 0;

        // Leading empty slots for alignment
        for (let i = 0; i < firstDayIndex; i++) {
            daysArray.push({ isEmpty: true, id: `empty-${i}` });
        }

        // Days of the month
        for (let d = 1; d <= totalDays; d++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isCompleted = habit.completedDates?.includes(dateString);
            const isToday = dateString === today;
            const isFuture = dateString > today;

            if (isCompleted) {
                completed++;
            }

            daysArray.push({
                isEmpty: false,
                dayNumber: d,
                dateString,
                isCompleted,
                isToday,
                isFuture,
                id: dateString,
            });
        }

        const percentage = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;

        return {
            days: daysArray,
            completedCount: completed,
            totalDaysInMonth: totalDays,
            percentCompleted: percentage,
        };
    }, [year, month, habit.completedDates, today]);

    const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="mt-4 pt-4 border-t border-gray-800 bg-gray-950/40 rounded-xl p-3.5 sm:p-4">
            {/* Header: Month Navigator + Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={handlePrevMonth}
                            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
                            title="Previous month"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-semibold text-white tracking-tight min-w-[130px] text-center">
                            {monthName}
                        </span>
                        <button
                            onClick={handleNextMonth}
                            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
                            title="Next month"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <button
                        onClick={handleCurrentMonth}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-0.5 rounded-md hover:bg-indigo-500/10 transition cursor-pointer"
                    >
                        Today
                    </button>
                </div>

                {/* Monthly Adherence Badge */}
                <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-400">Monthly Adherence:</span>
                    <span className="font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        {completedCount} / {totalDaysInMonth} days ({percentCompleted}%)
                    </span>
                </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {WEEKDAYS.map((wd) => (
                    <span key={wd} className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        {wd}
                    </span>
                ))}
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map((item) => {
                    if (item.isEmpty) {
                        return <div key={item.id} className="h-8" />;
                    }

                    return (
                        <button
                            key={item.id}
                            type="button"
                            disabled={!item.isToday}
                            onClick={() => onToggle && onToggle(habit._id, item.dateString)}
                            title={
                                item.isToday
                                    ? `${item.dateString} (Today): ${item.isCompleted ? 'Completed' : 'Incomplete'} - Click to toggle`
                                    : `${item.dateString}: ${item.isCompleted ? 'Completed' : 'Not completed'}`
                            }
                            className={`h-8 rounded-lg text-xs font-medium flex items-center justify-center transition select-none ${
                                item.isCompleted
                                    ? `bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10 ${
                                          item.isToday ? 'hover:bg-emerald-500/30 cursor-pointer' : 'cursor-default'
                                      }`
                                    : item.isToday
                                    ? 'bg-gray-800 text-white border border-indigo-500/60 hover:border-indigo-400 cursor-pointer font-bold'
                                    : item.isFuture
                                    ? 'text-gray-700 cursor-default opacity-30'
                                    : 'text-gray-500 cursor-default border border-transparent'
                            }`}
                        >
                            {item.dayNumber}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HabitCalendar;