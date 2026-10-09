import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  RefreshCw,
  Target,
  CheckCircle2,
  Flame,
  TrendingUp,
  Plus,
  Calendar,
  Layers,
  Zap,
  Award,
  Quote,
} from 'lucide-react';

import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';
import HabitFilterBar from '../components/HabitFilterBar';
import HabitCard from '../components/HabitCard';
import HabitModal, { HABIT_TEMPLATES } from '../components/HabitModal';
import HabitDetailModal from '../components/HabitDetailModal';
import ConnectionBanner from '../components/ConnectionBanner';
import NotificationToast from '../components/NotificationToast';
import ProfileVaultModal from '../components/ProfileVaultModal';
import GoalPlansView from '../components/GoalPlansView';
import GoalModal from '../components/GoalModal';

import { habitApi } from '../services/habitApi';
import { goalApi } from '../services/goalApi';
import {
  getLocalDateString,
  getPastNDays,
  calculateStreak,
  isDateCompleted,
  isDateSkipped,
  CATEGORIES,
} from '../utils/habitUtils';
import { getDailyQuote } from '../utils/quoteUtils';
import {
  sendDesktopNotification,
  formatTime12Hour,
} from '../utils/notificationUtils';

const Dashboard = () => {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Top Dashboard View Switcher: 'habits' | 'goals'
  const [dashboardTab, setDashboardTab] = useState('habits');

  // Profile & Private Vault Modal State
  const [isProfileVaultOpen, setIsProfileVaultOpen] = useState(false);
  const [profileVaultInitialTab, setProfileVaultInitialTab] = useState('profile');

  // Dedicated Goal Plans State
  const [goals, setGoals] = useState([]);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Habits and Network Status
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(true);
  const [apiErrorMessage, setApiErrorMessage] = useState('');

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFrequency, setSelectedFrequency] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Habit Detail Analytics Modal State
  const [selectedDetailHabit, setSelectedDetailHabit] = useState(null);

  // Keep selected detail habit in sync with habit updates
  const activeDetailHabit = useMemo(() => {
    if (!selectedDetailHabit) return null;
    const found = habits.find(
      (h) => (h._id || h.id) === (selectedDetailHabit._id || selectedDetailHabit.id)
    );
    return found || selectedDetailHabit;
  }, [habits, selectedDetailHabit]);

  // Authentication protection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  // Date constants
  const past7Days = useMemo(() => getPastNDays(7), []);
  const todayStr = useMemo(() => getLocalDateString(new Date()), []);

  // Daily Motivational Quote (automatically rotates with calendar date)
  const dailyQuote = useMemo(() => getDailyQuote(new Date()), []);

  // Active Reminder In-App Notification Toast
  const [activeNotification, setActiveNotification] = useState(null);

  // Background reminder scheduler effect: checks active habit & goal reminders every 25 seconds
  useEffect(() => {
    const checkScheduledReminders = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMins = String(now.getMinutes()).padStart(2, '0');
      const currentHHMM = `${currentHours}:${currentMins}`;
      const hourNum = now.getHours();

      let notifiedCache = {};
      try {
        notifiedCache = JSON.parse(
          localStorage.getItem('habit_tracker_notified_reminders') || '{}'
        );
      } catch {
        notifiedCache = {};
      }

      // 1. Check habits
      habits.forEach((habit) => {
        if (!habit.reminderEnabled) return;

        let shouldTrigger = false;
        let triggerKey = '';

        if (habit.reminderType === 'interval') {
          const start = habit.reminderStartHour !== undefined ? habit.reminderStartHour : 8;
          const end = habit.reminderEndHour !== undefined ? habit.reminderEndHour : 21;
          const interval = habit.reminderIntervalHours || 2;

          if (hourNum >= start && hourNum <= end) {
            if (hourNum % Math.floor(interval) === 0) {
              triggerKey = `${habit._id || habit.id}_${todayStr}_h${hourNum}`;
              shouldTrigger = true;
            }
          }
        } else if (habit.reminderTime && habit.reminderTime === currentHHMM) {
          triggerKey = `${habit._id || habit.id}_${todayStr}`;
          shouldTrigger = true;
        }

        if (!shouldTrigger || !triggerKey || notifiedCache[triggerKey]) return;

        // Don't remind if already completed or resting today (for fixed daily tasks)
        const isDone = isDateCompleted(habit, todayStr);
        const isRest = isDateSkipped(habit, todayStr);
        if (habit.reminderType !== 'interval' && (isDone || isRest)) return;

        // Mark reminded
        notifiedCache[triggerKey] = true;
        localStorage.setItem(
          'habit_tracker_notified_reminders',
          JSON.stringify(notifiedCache)
        );

        const isHydration = habit.reminderCategory === 'hydration';
        const isWalk = habit.reminderCategory === 'walk';

        const notifTitle = isHydration
          ? `💧 Hydration Nudge: ${habit.title}`
          : isWalk
          ? `🚶 Walk Break: ${habit.title}`
          : `Habit Reminder: ${habit.title}`;

        const notifBody = isHydration
          ? habit.description || 'Time to drink a glass of water (250ml) and stay hydrated!'
          : isWalk
          ? habit.description || 'Stand up, stretch, and take a quick 5-min walk break!'
          : habit.description || `It's time to check in!`;

        // Fire Notifications
        sendDesktopNotification(notifTitle, { body: notifBody });
        setActiveNotification({
          habit,
          type: habit.reminderCategory || 'custom',
          reminderCategory: habit.reminderCategory || 'custom',
          habitTitle: habit.title,
          time:
            habit.reminderType === 'interval'
              ? `Every ${habit.reminderIntervalHours || 2}h`
              : formatTime12Hour(habit.reminderTime),
          message: notifBody,
        });
      });

      // 2. Check Goal Plans
      (goals || []).forEach((goal) => {
        if (!goal.reminderEnabled) return;

        let shouldTrigger = false;
        let triggerKey = '';

        if (goal.reminderType === 'interval') {
          const start = goal.reminderStartHour !== undefined ? goal.reminderStartHour : 8;
          const end = goal.reminderEndHour !== undefined ? goal.reminderEndHour : 21;
          const interval = goal.reminderIntervalHours || 2;

          if (hourNum >= start && hourNum <= end) {
            if (hourNum % Math.floor(interval) === 0) {
              triggerKey = `goal_${goal._id || goal.id}_${todayStr}_h${hourNum}`;
              shouldTrigger = true;
            }
          }
        } else if (goal.reminderTime && goal.reminderTime === currentHHMM) {
          triggerKey = `goal_${goal._id || goal.id}_${todayStr}`;
          shouldTrigger = true;
        }

        if (!shouldTrigger || !triggerKey || notifiedCache[triggerKey]) return;

        notifiedCache[triggerKey] = true;
        localStorage.setItem(
          'habit_tracker_notified_reminders',
          JSON.stringify(notifiedCache)
        );

        const isHydration = goal.reminderCategory === 'hydration';
        const isWalk = goal.reminderCategory === 'walk';

        const notifTitle = isHydration
          ? `💧 Hydration Nudge: Drink Water!`
          : isWalk
          ? `🚶 Walk Break: Time to Move!`
          : `Goal Reminder: ${goal.title}`;

        const notifBody = isHydration
          ? `Stay hydrated for your "${goal.title}" plan: Drink a glass of water now!`
          : isWalk
          ? `Movement break for "${goal.title}": Get up and take 250 steps!`
          : `Time to execute daily routine habits for "${goal.title}".`;

        sendDesktopNotification(notifTitle, { body: notifBody });
        setActiveNotification({
          type: goal.reminderCategory || 'custom',
          reminderCategory: goal.reminderCategory || 'custom',
          habitTitle: goal.title,
          time:
            goal.reminderType === 'interval'
              ? `Every ${goal.reminderIntervalHours || 2}h`
              : formatTime12Hour(goal.reminderTime),
          message: notifBody,
        });
      });
    };

    checkScheduledReminders();
    const intervalId = setInterval(checkScheduledReminders, 25000);
    return () => clearInterval(intervalId);
  }, [habits, goals, todayStr]);

  // Fetch habits from backend API
  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    setApiErrorMessage('');
    try {
      const data = await habitApi.getAll();
      const habitList = Array.isArray(data) ? data : data.habits || [];
      setHabits(habitList);
      setIsBackendConnected(true);
    } catch (err) {
      setIsBackendConnected(false);
      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to connect to backend server at http://localhost:5000.';
      setApiErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Goals Data Fetcher
  const fetchGoals = useCallback(async () => {
    try {
      const data = await goalApi.getAll();
      setGoals(data || []);
    } catch (e) {
      console.error('Error fetching goals:', e);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Goal CRUD Handlers
  const handleSaveGoal = async (goalData) => {
    if (editingGoal) {
      const goalId = editingGoal._id || editingGoal.id;
      const updated = await goalApi.update(goalId, goalData);
      setGoals((prev) =>
        prev.map((g) => ((g._id || g.id) === goalId ? updated : g))
      );
    } else {
      const created = await goalApi.create(goalData);
      setGoals((prev) => [created, ...prev]);
    }
    setIsGoalModalOpen(false);
    setEditingGoal(null);
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal plan?')) return;
    await goalApi.delete(goalId);
    setGoals((prev) => prev.filter((g) => (g._id || g.id) !== goalId));
  };

  const handleToggleGoalHabit = async (goalId, habitId, date) => {
    const updated = await goalApi.toggleHabitDate(goalId, habitId, date);
    if (updated) {
      setGoals((prev) =>
        prev.map((g) => ((g._id || g.id) === goalId ? updated : g))
      );
    }
  };

  // Authentication Handlers
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Modal Handlers
  const handleOpenModal = (habit = null) => {
    setEditingHabit(habit);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHabit(null);
    setFormError('');
  };

  // Habit CRUD Actions
  const handleSaveHabit = async (formData) => {
    if (!formData.title?.trim()) {
      setFormError('Habit title is required.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const isTemplate = editingHabit && editingHabit.id && String(editingHabit.id).startsWith('tmpl_');
      if (editingHabit && !isTemplate) {
        const habitId = editingHabit._id || editingHabit.id;
        const updated = await habitApi.update(habitId, formData);
        setHabits((prev) =>
          prev.map((h) =>
            (h._id || h.id) === habitId ? updated.habit || updated : h
          )
        );
      } else {
        const created = await habitApi.create(formData);
        const newHabit = created.habit || created;
        setHabits((prev) => [newHabit, ...prev]);
      }
      handleCloseModal();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          err.message ||
          'Failed to save habit to backend API.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;

    try {
      await habitApi.delete(habitId);
      setHabits((prev) => prev.filter((h) => (h._id || h.id) !== habitId));
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to delete habit. Please check your backend connection.'
      );
    }
  };

  const handleToggleDate = async (habit, dateStr, explicitStatus) => {
    // Only the current day can be toggled or marked as rest day
    if (dateStr !== todayStr) {
      alert(
        'Past days are locked as historical records and cannot be modified. Only the current day can be marked as completed or rest day.'
      );
      return;
    }

    const habitId = habit._id || habit.id;
    const completedDates = habit.completedDates || [];
    const skippedDates = habit.skippedDates || [];

    const isCompleted = isDateCompleted(habit, dateStr);
    const isSkipped = isDateSkipped(habit, dateStr);

    let nextCompletedDates = [...completedDates];
    let nextSkippedDates = [...skippedDates];
    let targetStatus = explicitStatus;

    if (!targetStatus) {
      if (!isCompleted && !isSkipped) {
        targetStatus = 'completed';
      } else if (isCompleted) {
        targetStatus = 'skipped';
      } else {
        targetStatus = 'none';
      }
    }

    const cleanDate = (d) =>
      typeof d === 'string' ? d.split('T')[0] : d?.date?.split('T')[0];

    if (targetStatus === 'completed') {
      if (!isCompleted) nextCompletedDates.push(dateStr);
      nextSkippedDates = nextSkippedDates.filter((d) => cleanDate(d) !== dateStr);
    } else if (targetStatus === 'skipped') {
      if (!isSkipped) nextSkippedDates.push(dateStr);
      nextCompletedDates = nextCompletedDates.filter((d) => cleanDate(d) !== dateStr);
    } else {
      nextCompletedDates = nextCompletedDates.filter((d) => cleanDate(d) !== dateStr);
      nextSkippedDates = nextSkippedDates.filter((d) => cleanDate(d) !== dateStr);
    }

    // Optimistic UI update
    setHabits((prev) =>
      prev.map((h) =>
        (h._id || h.id) === habitId
          ? {
              ...h,
              completedDates: nextCompletedDates,
              skippedDates: nextSkippedDates,
            }
          : h
      )
    );

    // Sync with backend API
    try {
      const response = await habitApi.toggleDate(habitId, dateStr, targetStatus);
      if (response && response.habit) {
        setHabits((prev) =>
          prev.map((h) => ((h._id || h.id) === habitId ? response.habit : h))
        );
      }
    } catch (err) {
      console.error('Failed to sync toggle with backend API:', err);
      // Revert optimistic update
      setHabits((prev) =>
        prev.map((h) =>
          (h._id || h.id) === habitId
            ? { ...h, completedDates, skippedDates }
            : h
        )
      );
      alert('Could not update check-in on backend server.');
    }
  };

  // Filtered Habits
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        habit.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesFrequency =
        selectedFrequency === 'All' ||
        habit.frequency?.toLowerCase() === selectedFrequency.toLowerCase();
      const matchesSearch =
        habit.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesFrequency && matchesSearch;
    });
  }, [habits, selectedCategory, selectedFrequency, searchQuery]);

  // Aggregate Metrics
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    let completedTodayCount = 0;
    let maxStreak = 0;
    let totalConsistencyScore = 0;

    habits.forEach((habit) => {
      if (isDateCompleted(habit, todayStr)) {
        completedTodayCount += 1;
      }
      const streakInfo = calculateStreak(habit.completedDates, habit.skippedDates);
      if (streakInfo.current > maxStreak) {
        maxStreak = streakInfo.current;
      }

      const dates = habit.completedDates || [];
      const score = Math.min(100, Math.round((dates.length / 30) * 100));
      totalConsistencyScore += score;
    });

    const completionRate =
      totalHabits > 0
        ? Math.round((completedTodayCount / totalHabits) * 100)
        : 0;
    const avgConsistency =
      totalHabits > 0
        ? Math.round(totalConsistencyScore / totalHabits)
        : 0;

    return {
      totalHabits,
      completedTodayCount,
      completionRate,
      maxStreak,
      avgConsistency,
    };
  }, [habits, todayStr]);

  // Chart data for weekly trend
  const chartData = useMemo(() => {
    return past7Days.map((day) => {
      const count = habits.filter((h) =>
        isDateCompleted(h, day.dateStr)
      ).length;
      return {
        day: day.isToday ? 'Today' : day.dayName,
        completed: count,
        total: habits.length,
      };
    });
  }, [past7Days, habits]);

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-[40%] right-[30%] w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Modular Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onNewHabit={() => {
          if (dashboardTab === 'goals') {
            setEditingGoal(null);
            setIsGoalModalOpen(true);
          } else {
            handleOpenModal();
          }
        }}
        onLogout={handleLogout}
        onOpenProfile={(tab) => {
          setProfileVaultInitialTab(tab || 'profile');
          setIsProfileVaultOpen(true);
        }}
        onOpenVault={() => {
          setProfileVaultInitialTab('vault');
          setIsProfileVaultOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Modular Connection Error Banner */}
        <ConnectionBanner
          isBackendConnected={isBackendConnected}
          errorMessage={apiErrorMessage}
          onRetry={fetchHabits}
          isLoading={isLoading}
        />

        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Routine Performance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                {currentUser?.name || 'Champion'}
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchHabits();
                fetchGoals();
              }}
              disabled={isLoading}
              title="Refresh data"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Navigation View Switcher (Habits Tracker vs Goal Plans) */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-2xl w-fit backdrop-blur-xl">
          <button
            onClick={() => setDashboardTab('habits')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              dashboardTab === 'habits'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Habits Tracker</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {habits.length}
            </span>
          </button>

          <button
            onClick={() => setDashboardTab('goals')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              dashboardTab === 'goals'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Goal Plans (e.g. Diet)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {goals.length}
            </span>
          </button>
        </div>

        {dashboardTab === 'goals' ? (
          <GoalPlansView
            goals={goals}
            onNewGoal={() => {
              setEditingGoal(null);
              setIsGoalModalOpen(true);
            }}
            onEditGoal={(goal) => {
              setEditingGoal(goal);
              setIsGoalModalOpen(true);
            }}
            onDeleteGoal={handleDeleteGoal}
            onToggleGoalHabit={handleToggleGoalHabit}
          />
        ) : (
          <>

        {/* Daily Motivational Quote */}
        {dailyQuote && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-indigo-950/40 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5 shadow-inner">
                <Quote className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    Daily Wisdom
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-400 font-medium">
                    {dailyQuote.tag}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-200 italic leading-snug">
                  "{dailyQuote.quote}"
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-1.5">
                  — {dailyQuote.author}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4 Modular KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Habits"
            value={stats.totalHabits}
            subValue="tracked"
            subtitle="Across all categories"
            icon={Target}
            colorScheme="indigo"
            footerIcon={Layers}
          />

          <StatCard
            title="Today's Progress"
            value={`${stats.completedTodayCount}/${stats.totalHabits}`}
            subValue={`${stats.completionRate}%`}
            icon={CheckCircle2}
            colorScheme="emerald"
            progressBar={stats.completionRate}
          />

          <StatCard
            title="Top Active Streak"
            value={stats.maxStreak}
            subValue="days"
            subtitle="Unbroken consistency"
            icon={Flame}
            colorScheme="orange"
            footerIcon={Zap}
          />

          <StatCard
            title="Consistency Score"
            value={`${stats.avgConsistency}%`}
            subValue="index"
            subtitle="Algorithm rating"
            icon={TrendingUp}
            colorScheme="purple"
            footerIcon={Award}
          />
        </div>

        {/* Modular Analytics Chart */}
        <AnalyticsChart chartData={chartData} />

        {/* Modular Filter and Search Bar */}
        <HabitFilterBar
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedFrequency={selectedFrequency}
          onSelectFrequency={setSelectedFrequency}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Habits List Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Your Habit Tracker</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                {filteredHabits.length}
              </span>
            </h2>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-28 rounded-2xl bg-slate-900/40 border border-slate-800/60 animate-pulse"
                />
              ))}
            </div>
          ) : filteredHabits.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                No habits found
              </h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
                {searchQuery || selectedCategory !== 'All'
                  ? 'No habits match your active filters. Try adjusting your search query or category.'
                  : 'Start building consistency today by creating your first daily or weekly habit.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Habit</span>
                </button>
              </div>

              {/* Starter Templates in Empty State */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 max-w-lg mx-auto text-left">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Popular Starter Templates:</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {HABIT_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleOpenModal(tmpl)}
                      className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all text-left flex items-start gap-2.5 cursor-pointer group"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{tmpl.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white group-hover:text-indigo-300 truncate">
                          {tmpl.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {tmpl.category} • {tmpl.targetDays} days/wk
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Modular Habit Cards List */
            <div className="space-y-3">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit._id || habit.id}
                  habit={habit}
                  past7Days={past7Days}
                  todayStr={todayStr}
                  onToggleDate={handleToggleDate}
                  onEdit={handleOpenModal}
                  onDelete={handleDeleteHabit}
                  onViewDetails={setSelectedDetailHabit}
                />
              ))}
            </div>
          )}
        </div>
          </>
        )}
      </main>

      {/* Modular Habit Create / Edit Modal */}
      <HabitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveHabit}
        initialData={editingHabit}
        isSaving={isSaving}
        formError={formError}
      />

      {/* Habit Routine Detail & Pie Chart Modal */}
      <HabitDetailModal
        isOpen={Boolean(selectedDetailHabit)}
        onClose={() => setSelectedDetailHabit(null)}
        habit={activeDetailHabit}
        todayStr={todayStr}
      />

      {/* Floating In-App Reminder Toast */}
      <NotificationToast
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
        onMarkDone={(habit) => {
          handleToggleDate(habit, todayStr, 'completed');
        }}
      />

      {/* Profile Photo & Private Passcode Vault Modal */}
      <ProfileVaultModal
        isOpen={isProfileVaultOpen}
        onClose={() => setIsProfileVaultOpen(false)}
        currentUser={currentUser}
        initialTab={profileVaultInitialTab}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
        }}
      />

      {/* Goal Plan Create / Edit Modal */}
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={handleSaveGoal}
        editingGoal={editingGoal}
      />
    </div>
  );
};

export default Dashboard;