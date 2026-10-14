import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';

const ProgressPieChart = ({ habits = [], today, complete: defaultComplete, total: defaultTotal }) => {
    // Timeframe mode: 'today' | '7days' | '30days' | 'custom'
    const [timeframe, setTimeframe] = useState('today');
    const [customDate, setCustomDate] = useState(() => today || new Date().toISOString().split('T')[0]);

    // Calculate metrics based on timeframe or fallback props
    const { complete, total, remaining, percentage, label, subtext } = useMemo(() => {
        // Fallback if raw complete/total numbers were passed directly and no habits array
        if (!habits || habits.length === 0) {
            const c = defaultComplete || 0;
            const t = defaultTotal || 0;
            const r = Math.max(0, t - c);
            const p = t > 0 ? Math.round((c / t) * 100) : 0;
            return {
                complete: c,
                total: t,
                remaining: r,
                percentage: p,
                label: "Today's Adherence",
                subtext: `You've checked off ${c} out of ${t} habits.`,
            };
        }

        const todayStr = today || new Date().toISOString().split('T')[0];

        // Single Day: Today
        if (timeframe === 'today') {
            const c = habits.filter((h) => h.completedDates?.includes(todayStr)).length;
            const t = habits.length;
            const r = Math.max(0, t - c);
            const p = t > 0 ? Math.round((c / t) * 100) : 0;
            return {
                complete: c,
                total: t,
                remaining: r,
                percentage: p,
                label: "Today's Adherence",
                subtext: `You've checked off ${c} out of ${t} habits for today.`,
            };
        }

        // Single Day: Custom Picked Date
        if (timeframe === 'custom') {
            const targetDate = customDate || todayStr;
            const c = habits.filter((h) => h.completedDates?.includes(targetDate)).length;
            const t = habits.length;
            const r = Math.max(0, t - c);
            const p = t > 0 ? Math.round((c / t) * 100) : 0;
            const formatted = new Date(targetDate + 'T00:00:00').toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
            return {
                complete: c,
                total: t,
                remaining: r,
                percentage: p,
                label: `Progress for ${formatted}`,
                subtext: `You checked off ${c} out of ${t} habits on this day.`,
            };
        }

        // Time Span: 7 Days or 30 Days
        const spanDays = timeframe === '7days' ? 7 : 30;
        const dateList = [];
        for (let i = spanDays - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dateList.push(d.toISOString().split('T')[0]);
        }

        let totalCompletedChecks = 0;
        habits.forEach((h) => {
            const completedInSpan = h.completedDates?.filter((date) => dateList.includes(date)).length || 0;
            totalCompletedChecks += completedInSpan;
        });

        const totalPossibleChecks = habits.length * spanDays;
        const remainingChecks = Math.max(0, totalPossibleChecks - totalCompletedChecks);
        const p = totalPossibleChecks > 0 ? Math.round((totalCompletedChecks / totalPossibleChecks) * 100) : 0;

        return {
            complete: totalCompletedChecks,
            total: totalPossibleChecks,
            remaining: remainingChecks,
            percentage: p,
            label: `${spanDays}-Day Adherence`,
            subtext: `You logged ${totalCompletedChecks} out of ${totalPossibleChecks} total check-ins across the last ${spanDays} days.`,
        };
    }, [habits, today, timeframe, customDate, defaultComplete, defaultTotal]);

    const data = [
        { name: 'Completed', value: complete },
        { name: 'Remaining', value: remaining },
    ];

    if (total === 0 && (!habits || habits.length === 0)) return null;

    return (
        <div className="bg-gray-900 border border-gray-800/90 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Timeframe Filter Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-800/80 relative z-10">
                <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                        Progress Filter:
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-gray-950/60 p-1 rounded-xl border border-gray-800 text-xs">
                    <button
                        onClick={() => setTimeframe('today')}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                            timeframe === 'today'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setTimeframe('7days')}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                            timeframe === '7days'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setTimeframe('30days')}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                            timeframe === '30days'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setTimeframe('custom')}
                        className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                            timeframe === 'custom'
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Specific Day
                    </button>
                </div>

                {/* Date Picker */}
                {timeframe === 'custom' && (
                    <div className="w-full sm:w-auto flex items-center gap-2 justify-end">
                        <span className="text-xs text-gray-400">Select Date:</span>
                        <input
                            type="date"
                            max={today || new Date().toISOString().split('T')[0]}
                            value={customDate}
                            onChange={(e) => setCustomDate(e.target.value)}
                            className="bg-gray-800 border border-gray-700 text-white text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark] cursor-pointer"
                        />
                    </div>
                )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                {/* 1. Donut Ring with Ambient Glow */}
                <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                    {/* Ring Halo */}
                    <div className="absolute w-28 h-28 rounded-full bg-emerald-500/15 blur-xl pointer-events-none" />

                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="progressGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={data}
                                innerRadius={54}
                                outerRadius={72}
                                cornerRadius={8}
                                paddingAngle={remaining > 0 && complete > 0 ? 5 : 0}
                                dataKey="value"
                                startAngle={90}
                                endAngle={-270}
                                stroke="none"
                            >
                                <Cell fill="url(#progressGradient)" />
                                <Cell fill="#1f2937" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Percentage */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-extrabold text-white tracking-tight">
                            {percentage}<span className="text-lg font-bold text-emerald-400">%</span>
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
                            Adherence
                        </span>
                    </div>
                </div>

                {/* 2. Stats & Status Details */}
                <div className="flex-1 w-full space-y-4 text-center sm:text-left">
                    <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{label}</h3>
                        <p className="text-xs text-gray-400 mt-1">{subtext}</p>
                    </div>

                    {/* Pill Badges */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-2.5 flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0">
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Done</p>
                                <p className="text-sm font-bold text-white">
                                    {complete} {timeframe === '7days' || timeframe === '30days' ? 'checks' : 'habits'}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-800/40 border border-gray-800 rounded-xl p-2.5 flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gray-700/30 text-gray-400 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div className="text-left min-w-0">
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Remaining</p>
                                <p className="text-sm font-bold text-white">
                                    {remaining} {timeframe === '7days' || timeframe === '30days' ? 'checks' : 'habits'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressPieChart;
