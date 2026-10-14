import { useAuth } from '../context/AuthContext';
import { Sparkles, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur sticky top-0 z-20">
            <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                
                {/* Brand Logo & Name */}
                <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-lg text-white tracking-tight">HabitFlow</span>
                </div>

                {/* User Info & Logout Button */}
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
    );
};

export default Navbar;
