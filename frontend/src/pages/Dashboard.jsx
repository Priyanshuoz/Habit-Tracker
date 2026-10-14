import { useAuth } from '../context/AuthContext';

const Dashboard = () =>{
    const {user, logout} = useAuth();

    return(
        <div className="min-h-screen bg-gray-900 p-6 text-gray-100">
            <div className="max-w-4xl mx-auto flex justify-between items-center bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700">
                <div>
                    <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}!</h1>
                    <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                </div>
                <button
                    onClick={logout}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Dashboard;