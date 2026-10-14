import Navbar from '../includes/Navbar';
import Footer from '../includes/Footer';

const Boilerplate = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col justify-between">
            {/* 1. Navbar */}
            <Navbar />

            {/* 2. Container (where page content / body goes) */}
            <main className="flex-1 max-w-4xl mx-auto px-4 py-8 space-y-6 w-full">
                {children}
            </main>

            {/* 3. Footer */}
            <Footer />
        </div>
    );
};

export default Boilerplate;
