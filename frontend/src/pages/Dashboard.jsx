import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API from '../api';
import Boilerplate from '../layouts/Boilerplate';
import HabitCard from '../components/HabitCard';
import ProgressPieChart from '../components/ProgressPieChart';
import DailyQuote from '../components/DailyQuote';
import {
    Plus,
    Target,
    TrendingUp,
    Flame
} from 'lucide-react';

const Dashboard = () => {
    const [habits, setHabits] = useState([]);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');

    const today = new Date().toISOString().split('T')[0];

    const fetchHabits = async () => {
        try {
            const res = await API.get('/habits');
            setHabits(res.data);
        } catch (err) {
            console.error('Failed to fetch habits', err);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    // 1. Add new habit
    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await API.post('/habits', { title: title.trim(), category });
            setHabits([res.data, ...habits]);
            setTitle('');
            toast.success('Habit added! 🚀');
        } catch (err) {
            console.error('Failed to create habit', err);
            toast.error(err.response?.data?.message || 'Failed to create habit');
        }
    };

    // 2. Toggle completed for today
    const handleToggle = async (id, targetDate = today) => {
        try {
            const res = await API.put(`/habits/${id}/toggle`, { date: targetDate });
            setHabits(habits.map((h) => (h._id === id ? res.data : h)));
            const isDone = res.data.completedDates?.includes(targetDate);
            toast.success(isDone ? 'Habit completed! 🔥' : 'Marked incomplete');
        } catch (err) {
            console.error('Failed to toggle habit', err);
            toast.error('Failed to update habit');
        }
    };

    // 3. Delete habit
    const handleDelete = async (id) => {
        try {
            await API.delete(`/habits/${id}`);
            setHabits(habits.filter((h) => h._id !== id));
            toast.success('Habit deleted');
        } catch (err) {
            console.error('Failed to delete habit', err);
            toast.error('Failed to delete habit');
        }
    };

    // 4. Update habit (inline edit)
    const handleUpdate = async (id, updatedData) => {
        try {
            const res = await API.put(`/habits/${id}`, updatedData);
            setHabits(habits.map((h) => (h._id === id ? res.data : h)));
            toast.success('Habit updated! ✏️');
        } catch (err) {
            console.error('Failed to update habit', err);
            toast.error(err.response?.data?.message || 'Failed to update habit');
        }
    };

    const completedToday = habits.filter((h) => h.completedDates?.includes(today)).length;
    const totalHabits = habits.length;
    const percentDone = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const currentStreak = habits.length > 0
        ? Math.max(...habits.map((h) => h.currentStreak || 0))
        : 0;

    return (

        <Boilerplate>
            {/* Daily Motivational Quote */}
            <DailyQuote today={today} />

            {/* 1. Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <Target className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Completed Today</p>
                        <p className="text-2xl font-bold text-white">
                            {completedToday} <span className="text-sm font-normal text-gray-500">/ {totalHabits}</span>
                        </p>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Success Rate</p>
                        <p className="text-2xl font-bold text-white">{percentDone}%</p>
                    </div>
                </div>

                <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center space-x-4 shadow-sm">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                        <Flame className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current Streak</p>
                        <p className="text-2xl font-bold text-white">{currentStreak} days</p>
                    </div>
                </div>
            </div>

            <ProgressPieChart habits={habits} today={today} complete={completedToday} total={totalHabits} />

            {/* 2. Add Habit Form */}
            <form
                onSubmit={handleAddHabit}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row gap-3"
            >
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Read 20 pages, Morning workout, Meditate..."
                    className="flex-1 bg-gray-800/80 border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                />

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-gray-800/80 border border-gray-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                    <option value="General">General</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Study">Study</option>
                    <option value="Health">Health</option>
                    <option value="Mindset">Mindset</option>
                    <option value="Productivity">Productivity</option>
                </select>

                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition shadow cursor-pointer text-sm whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Habit</span>
                </button>
            </form>

            {/* 3. Habits List */}
            <div className="space-y-3 pt-2">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Today's Habits
                </h2>

                {habits.length === 0 ? (
                    <div className="bg-gray-900 border border-dashed border-gray-800 rounded-2xl p-10 text-center text-gray-500">
                        No habits yet. Add your first habit above to begin tracking your streaks!
                    </div>
                ) : (

                    habits.map((habit) => (
                        <HabitCard
                            key={habit._id}
                            habit={habit}
                            today={today}
                            onToggle={handleToggle}
                            onDelete={handleDelete}
                            onUpdate={handleUpdate}
                        />
                    ))

                )}
            </div>
        </Boilerplate>
    );
};

export default Dashboard;
