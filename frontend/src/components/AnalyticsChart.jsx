import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
  PieChart as PieChartIcon,
  CheckCircle2,
  Pause,
  AlertCircle,
  Copy,
  Check,
  Flame,
  ArrowUpRight,
  Layers,
  Clock,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  getLocalDateString,
  isDateCompleted,
  isDateSkipped,
  isDateMissed,
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
} from '../utils/habitUtils';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const AnalyticsChart = ({
  habits = [],
  goals = [],
  todayStr = getLocalDateString(new Date()),
  chartData = [],
}) => {
  // Timeframe Mode: 'weekly' | 'monthly'
  const [timeframe, setTimeframe] = useState('weekly');

  // Chart view tab: 'trend' | 'distribution' | 'category'
  const [activeChartTab, setActiveChartTab] = useState('trend');

  // Offset navigation: 0 = current, -1 = previous, etc.
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  // Copy report state
  const [copiedReport, setCopiedReport] = useState(false);

  // 1. Calculate Weekly Dates & Metadata
  const weeklyData = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + weekOffset * 7);

    // Monday as start of week
    const day = d.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMonday);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const cur = new Date(monday);
      cur.setDate(monday.getDate() + i);
      const dateStr = getLocalDateString(cur);
      days.push({
        date: cur,
        dateStr,
        dayName: cur.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: cur.getDate(),
        monthName: cur.toLocaleDateString('en-US', { month: 'short' }),
        isToday: dateStr === todayStr,
      });
    }

    const startLabel = days[0].date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endLabel = days[6].date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const periodLabel = `${startLabel} – ${endLabel}`;

    return { days, periodLabel, isCurrent: weekOffset === 0 };
  }, [weekOffset, todayStr]);

  // 2. Calculate Monthly Dates & Metadata
  const monthlyData = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);

    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const cur = new Date(year, month, i);
      const dateStr = getLocalDateString(cur);
      days.push({
        date: cur,
        dateStr,
        dayName: cur.toLocaleDateString('en-US', { weekday: 'narrow' }),
        dayNumber: i,
        weekNumber: Math.ceil(i / 7),
        isToday: dateStr === todayStr,
      });
    }

    const periodLabel = `${MONTH_NAMES[month]} ${year}`;
    const today = new Date();
    const isCurrent =
      year === today.getFullYear() && month === today.getMonth();

    return { days, periodLabel, year, month, isCurrent };
  }, [monthOffset, todayStr]);

  // Active Days in Period based on chosen timeframe
  const activePeriod = timeframe === 'weekly' ? weeklyData : monthlyData;
  const activeDays = activePeriod.days;

  // 3. Process All Analyzed Data for the Active Period
  const analyzedData = useMemo(() => {
    const totalHabits = habits.length;
    const totalPossible = totalHabits * activeDays.length;

    let totalCompleted = 0;
    let totalRest = 0;
    let totalMissed = 0;

    // Daily breakdown for timeline chart
    const dailyBreakdown = activeDays.map((day) => {
      let compCount = 0;
      let restCount = 0;
      let missCount = 0;

      habits.forEach((h) => {
        if (isDateCompleted(h, day.dateStr)) {
          compCount++;
        } else if (isDateSkipped(h, day.dateStr)) {
          restCount++;
        } else if (day.dateStr < todayStr) {
          missCount++;
        }
      });

      totalCompleted += compCount;
      totalRest += restCount;
      totalMissed += missCount;

      const rate = totalHabits > 0 ? Math.round((compCount / totalHabits) * 100) : 0;

      return {
        dateStr: day.dateStr,
        dayName: day.dayName,
        label:
          timeframe === 'weekly'
            ? `${day.dayName} (${day.dayNumber})`
            : `${day.dayNumber}`,
        completed: compCount,
        rest: restCount,
        missed: missCount,
        rate,
        totalHabits,
        isToday: day.isToday,
      };
    });

    // In Monthly mode: Also create Week 1 - Week 5 aggregate blocks
    const monthlyWeeklyBlocks = [];
    if (timeframe === 'monthly') {
      const weekGroups = {};
      dailyBreakdown.forEach((d, idx) => {
        const weekNum = Math.ceil((idx + 1) / 7);
        if (!weekGroups[weekNum]) {
          weekGroups[weekNum] = {
            name: `Week ${weekNum}`,
            completed: 0,
            rest: 0,
            missed: 0,
            daysCount: 0,
          };
        }
        weekGroups[weekNum].completed += d.completed;
        weekGroups[weekNum].rest += d.rest;
        weekGroups[weekNum].missed += d.missed;
        weekGroups[weekNum].daysCount += 1;
      });

      Object.keys(weekGroups).forEach((w) => {
        const g = weekGroups[w];
        const possible = totalHabits * g.daysCount;
        monthlyWeeklyBlocks.push({
          label: g.name,
          completed: g.completed,
          rest: g.rest,
          missed: g.missed,
          rate: possible > 0 ? Math.round((g.completed / possible) * 100) : 0,
        });
      });
    }

    // Adherence Rate
    const adherenceRate =
      totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    // Peak Productivity Day in this period
    let peakDay = null;
    let maxDayCompleted = -1;
    dailyBreakdown.forEach((d) => {
      if (d.completed > maxDayCompleted) {
        maxDayCompleted = d.completed;
        peakDay = d;
      }
    });

    // Habit-by-Habit Performance Matrix
    const habitScores = habits.map((h) => {
      let doneCount = 0;
      let skipCount = 0;

      activeDays.forEach((day) => {
        if (isDateCompleted(h, day.dateStr)) doneCount++;
        else if (isDateSkipped(h, day.dateStr)) skipCount++;
      });

      const habitRate =
        activeDays.length > 0
          ? Math.round((doneCount / activeDays.length) * 100)
          : 0;

      let statusBadge = {
        label: 'Needs Attention',
        color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
      };
      if (habitRate >= 90) {
        statusBadge = {
          label: '🔥 Crushing It',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
        };
      } else if (habitRate >= 70) {
        statusBadge = {
          label: '✓ Consistent',
          color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
        };
      } else if (habitRate >= 45) {
        statusBadge = {
          label: '📈 On Track',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        };
      }

      return {
        habit: h,
        title: h.title,
        category: h.category || 'Productivity',
        color: h.color || 'indigo',
        doneCount,
        skipCount,
        totalDays: activeDays.length,
        rate: habitRate,
        statusBadge,
      };
    });

    // Best Performing Habit
    const sortedHabits = [...habitScores].sort((a, b) => b.doneCount - a.doneCount);
    const bestHabit = sortedHabits[0] || null;

    // Category Breakdown
    const categoriesMap = {};
    habitScores.forEach((hs) => {
      const cat = hs.category || 'General';
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = {
          category: cat,
          completed: 0,
          possible: 0,
        };
      }
      categoriesMap[cat].completed += hs.doneCount;
      categoriesMap[cat].possible += hs.totalDays;
    });

    const categoryData = Object.values(categoriesMap).map((c) => ({
      name: c.category,
      completed: c.completed,
      possible: c.possible,
      rate: c.possible > 0 ? Math.round((c.completed / c.possible) * 100) : 0,
    }));

    // Status Distribution Pie Data
    const pieData = [
      { name: 'Completed Check-ins', value: totalCompleted, color: '#10b981' },
      { name: 'Rest / Skipped Days', value: totalRest, color: '#6366f1' },
      {
        name: 'Pending / Missed',
        value: Math.max(0, totalPossible - totalCompleted - totalRest),
        color: '#334155',
      },
    ].filter((item) => item.value > 0);

    return {
      dailyBreakdown,
      monthlyWeeklyBlocks,
      totalHabits,
      totalPossible,
      totalCompleted,
      totalRest,
      totalMissed,
      adherenceRate,
      peakDay,
      bestHabit,
      habitScores: sortedHabits,
      categoryData,
      pieData:
        pieData.length > 0
          ? pieData
          : [{ name: 'No Activity Yet', value: 1, color: '#334155' }],
    };
  }, [habits, activeDays, timeframe, todayStr]);

  // Copy formatted analysis summary report to clipboard
  const handleCopyReport = () => {
    const reportText = `📊 Habit Tracker Performance Report
Period: ${activePeriod.periodLabel} (${timeframe.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Adherence Rate: ${analyzedData.adherenceRate}%
• Total Completed: ${analyzedData.totalCompleted} / ${analyzedData.totalPossible} check-ins
• Rest Days Taken: ${analyzedData.totalRest}
• Best Performing Habit: ${analyzedData.bestHabit ? analyzedData.bestHabit.title + ' (' + analyzedData.bestHabit.rate + '%)' : 'N/A'}
• Peak Productive Day: ${analyzedData.peakDay ? analyzedData.peakDay.label + ' (' + analyzedData.peakDay.completed + ' check-ins)' : 'N/A'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Habits Breakdown:
${analyzedData.habitScores
  .map(
    (hs) =>
      ` - ${hs.title}: ${hs.doneCount}/${hs.totalDays} days (${hs.rate}%)`
  )
  .join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl shadow-2xl space-y-6">
      
      {/* 1. Header & Navigation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-md shadow-indigo-500/10">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Performance Analytics & Deep Reports</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                  Analyzed Data
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Detailed metrics for every week and month as you specify
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher & Navigator */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Week / Month Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTimeframe('weekly');
                setWeekOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly View
            </button>
            <button
              type="button"
              onClick={() => {
                setTimeframe('monthly');
                setMonthOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly View
            </button>
          </div>

          {/* Timeframe Navigator (< Prev, Label, Next >) */}
          <div className="flex items-center bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 gap-1.5">
            <button
              type="button"
              onClick={() => {
                if (timeframe === 'weekly') setWeekOffset((prev) => prev - 1);
                else setMonthOffset((prev) => prev - 1);
              }}
              title={timeframe === 'weekly' ? 'Previous Week' : 'Previous Month'}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-white px-2 whitespace-nowrap min-w-[130px] text-center">
              {activePeriod.periodLabel}
            </span>

            <button
              type="button"
              onClick={() => {
                if (timeframe === 'weekly') setWeekOffset((prev) => prev + 1);
                else setMonthOffset((prev) => prev + 1);
              }}
              title={timeframe === 'weekly' ? 'Next Week' : 'Next Month'}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Jump to Current Button (if not on current) */}
            {!activePeriod.isCurrent && (
              <button
                type="button"
                onClick={() => {
                  if (timeframe === 'weekly') setWeekOffset(0);
                  else setMonthOffset(0);
                }}
                title="Jump to Current Period"
                className="ml-1 p-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Now</span>
              </button>
            )}
          </div>

          {/* Copy Report Button */}
          <button
            type="button"
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/80 transition-all cursor-pointer"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Top Summary Metric Cards for the Specified Period */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Metric 1: Adherence */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Period Adherence</span>
            <Sparkles className="w-3 h-3 text-emerald-400" />
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {analyzedData.adherenceRate}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${analyzedData.adherenceRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Completed Check-ins */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Completed Tasks</span>
            <CheckCircle2 className="w-3 h-3 text-indigo-400" />
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {analyzedData.totalCompleted}
            </span>
            <span className="text-xs text-slate-500 font-normal">
              / {analyzedData.totalPossible}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">
            in this {timeframe === 'weekly' ? '7-day week' : 'month'}
          </p>
        </div>

        {/* Metric 3: Rest & Recovery Days */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Rest Days Taken</span>
            <Pause className="w-3 h-3 text-amber-400" />
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">
              {analyzedData.totalRest}
            </span>
            <span className="text-xs text-slate-500 font-normal">logged</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Streaks protected</p>
        </div>

        {/* Metric 4: MVP Habit */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
            <span>Top Habit</span>
            <Award className="w-3 h-3 text-amber-400" />
          </span>
          <p className="text-xs font-bold text-white truncate mt-1">
            {analyzedData.bestHabit ? analyzedData.bestHabit.title : 'None yet'}
          </p>
          <p className="text-[10px] text-emerald-400 font-semibold">
            {analyzedData.bestHabit
              ? `${analyzedData.bestHabit.doneCount} days completed (${analyzedData.bestHabit.rate}%)`
              : 'Add habits to begin'}
          </p>
        </div>
      </div>

      {/* 3. Visual Charts Section with Tabs */}
      <div className="space-y-4">
        {/* Chart View Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveChartTab('trend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'trend'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Completion Trend ({timeframe === 'weekly' ? 'Daily' : 'Weekly'})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveChartTab('distribution')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'distribution'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Status Distribution</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveChartTab('category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeChartTab === 'category'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Category Breakdown</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400">
            Evaluating {habits.length} habits across {activeDays.length} days
          </span>
        </div>

        {/* TAB 1: Trend Curved Area Chart */}
        {activeChartTab === 'trend' && (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    timeframe === 'weekly'
                      ? analyzedData.dailyBreakdown
                      : analyzedData.monthlyWeeklyBlocks
                  }
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="habitGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="restGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                  <XAxis
                    dataKey="label"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    }}
                    itemStyle={{ fontWeight: 600 }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Habits Completed"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#habitGradient)"
                    dot={{ r: 4, fill: '#6366f1', strokeWidth: 1.5, stroke: '#ffffff' }}
                    activeDot={{ r: 6, fill: '#818cf8', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rest"
                    name="Rest Days"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fillOpacity={1}
                    fill="url(#restGradient)"
                    dot={{ r: 3, fill: '#0ea5e9', strokeWidth: 1, stroke: '#ffffff' }}
                    activeDot={{ r: 5, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 2: Period Distribution Pie Chart */}
        {activeChartTab === 'distribution' && (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 h-72 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyzedData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analyzedData.pieData.map((entry, index) => (
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
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center Adherence Percentage */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-black text-white">
                  {analyzedData.adherenceRate}%
                </span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                  Period Adherence
                </span>
              </div>
            </div>

            {/* Right Indicators */}
            <div className="md:col-span-5 space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
                  <span className="text-xs text-slate-300 font-medium">Completed Checks</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {analyzedData.totalCompleted}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
                  <span className="text-xs text-slate-300 font-medium">Scheduled Rest</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {analyzedData.totalRest}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-600" />
                  <span className="text-xs text-slate-300 font-medium">Pending / Missed</span>
                </div>
                <span className="text-sm font-bold text-white">
                  {Math.max(
                    0,
                    analyzedData.totalPossible -
                      analyzedData.totalCompleted -
                      analyzedData.totalRest
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Category Performance */}
        {activeChartTab === 'category' && (
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            {analyzedData.categoryData.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No categories found.</p>
            ) : (
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyzedData.categoryData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      stroke="#94a3b8"
                      fontSize={11}
                      tickFormatter={(val) => `${val}%`}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [`${value}% Completion`, 'Adherence']}
                    />
                    <Bar
                      dataKey="rate"
                      name="Adherence Rate"
                      fill="#6366f1"
                      radius={[0, 6, 6, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Habit-by-Habit Detailed Scorecard Matrix */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Habit Scorecard for {activePeriod.periodLabel}</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            {analyzedData.habitScores.length} habits evaluated
          </span>
        </div>

        {analyzedData.habitScores.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No habits added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {analyzedData.habitScores.map((hs) => (
              <div
                key={hs.habit?._id || hs.habit?.id || hs.title}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-2.5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800">
                      {hs.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${hs.statusBadge.color}`}
                    >
                      {hs.statusBadge.label}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white truncate mt-2" title={hs.title}>
                    {hs.title}
                  </h4>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Completed in period:</span>
                    <span className="font-bold text-white">
                      {hs.doneCount} / {hs.totalDays} days ({hs.rate}%)
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        hs.rate >= 80
                          ? 'bg-emerald-500'
                          : hs.rate >= 50
                          ? 'bg-indigo-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${hs.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AnalyticsChart;
