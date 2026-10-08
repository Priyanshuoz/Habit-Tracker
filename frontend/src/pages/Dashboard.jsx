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
} from 'lucide-react';

import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import AnalyticsChart from '../components/AnalyticsChart';
import HabitFilterBar from '../components/HabitFilterBar';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import HabitDetailModal from '../components/HabitDetailModal';
import ConnectionBanner from '../components/ConnectionBanner';

import { habitApi } from '../services/habitApi';
import {
  getLocalDateString,
  getPastNDays,
  calculateStreak,
  isDateCompleted,
  isDateSkipped,
  CATEGORIES,
} from '../utils/habitUtils';

const Dashboard = () => {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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
      if (editingHabit) {
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
        onNewHabit={() => handleOpenModal()}
        onLogout={handleLogout}
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
              onClick={fetchHabits}
              disabled={isLoading}
              title="Refresh habits"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-xs font-medium cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

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
              <button
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Your First Habit</span>
              </button>
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
    </div>
  );
};

export default Dashboard;