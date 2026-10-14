import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import {
    CheckCircle2,
    Circle,
    Plus,
    Trash2,
    Flame,
    LogOut,
    Target,
    TrendingUp,
    Sparkles
} from 'lucide-react';

const CATEGORY_STYLES = {
    General: 'bg-gray-700/50 text-gray-300 border-gray-600',
    Fitness: 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30',
    Study: 'bg-blue-950/40 text-blue-400 border-blue-500/30',
    Health: 'bg-rose-950/40 text-rose-400 border-rose-500/30',
    Mindset: 'bg-purple-950/40 text-purple-400 border-purple-500/30',
    Productivity: 'bg-amber-950/40 text-amber-400 border-amber-500/30',
};

const Dashboard = () => {
    const { user, logout } = useAuth();
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

    // Add new habit
    const handleAddHabit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await API.post('/habits', { title, category });
            setHabits([res.data, ...habits]);
            setTitle('');
        } catch (err) {
            console.error('Failed to create habit', err);
        }
    };

    //Toggle completed for today
    const handleToggle = async (id) => {
        try {
            const res = await API.put(`/habits/${id}/toggle`, { date: today });
            setHabits(habits.map((h) => (h._id === id ? res.data : h)));
        } catch (err) {
            console.error('Failed to toggle habit', err);
        }
    };

    // Delete habit
    const handleDelete = async (id) => {
        try {
            await API.delete(`/habits/${id}`);
            setHabits(habits.filter((h) => h._id !== id));
        } catch (err) {
            console.error('Failed to delete habit', err);
        }
    };

    const completedToday = habits.filter((h) => h.completedDates?.includes(today)).length;
    const totalHabits = habits.length;
    const percentDone = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    const totalStreaks = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            
            {/* Top Navigation */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-20">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg text-white tracking-tight">HabitFlow</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-200">{user?.name}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 hover:border-red-500/40 text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto px-4 py-8 space-y-6 w-full flex-1">
                
                {/* Stats Row */}
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
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Streaks</p>
                            <p className="text-2xl font-bold text-white">{totalStreaks} days</p>
                        </div>
                    </div>
                </div>

                {/* Add Habit Form */}
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

                {/* Habits List */}
                <div className="space-y-3 pt-2">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Today's Habits
                    </h2>

                    {habits.length === 0 ? (
                        <div className="bg-gray-900 border border-dashed border-gray-800 rounded-2xl p-10 text-center text-gray-500">
                            No habits yet. Add your first habit above to begin tracking your streaks!
                        </div>
                    ) : (
                        habits.map((habit) => {
                            const isDoneToday = habit.completedDates?.includes(today);

                            return (
                                <div
                                    key={habit._id}
                                    className={`bg-gray-900 border rounded-2xl p-4 flex items-center justify-between transition-all duration-200 ${
                                        isDoneToday
                                            ? 'border-emerald-500/30 bg-emerald-950/10'
                                            : 'border-gray-800 hover:border-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                                        {/* Toggle Checkmark Button */}
                                        <button
                                            onClick={() => handleToggle(habit._id)}
                                            className="focus:outline-none transition transform active:scale-90 cursor-pointer"
                                            title={isDoneToday ? 'Mark incomplete' : 'Mark complete'}
                                        >
                                            {isDoneToday ? (
                                                <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950" />
                                            ) : (
                                                <Circle className="w-6 h-6 text-gray-600 hover:text-indigo-400" />
                                            )}
                                        </button>

                                        {/* Habit Details */}
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className={`text-sm font-medium transition ${
                                                    isDoneToday
                                                        ? 'line-through text-gray-500'
                                                        : 'text-gray-100'
                                                }`}
                                            >
                                                {habit.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span
                                                    className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${
                                                        CATEGORY_STYLES[habit.category] || CATEGORY_STYLES.General
                                                    }`}
                                                >
                                                    {habit.category}
                                                </span>

                                                <span className="flex items-center text-xs font-medium text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                                    <Flame className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                                                    {habit.currentStreak || 0} streak
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(habit._id)}
                                        className="text-gray-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition cursor-pointer ml-3"
                                        title="Delete habit"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
