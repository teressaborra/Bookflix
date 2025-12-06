import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen bg-dark text-white">
            <Navbar transparent={isHome} />
            <main>
                <Outlet />
            </main>
            <footer className="bg-black/50 border-t border-white/5 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500">© 2025 BookFlix. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
