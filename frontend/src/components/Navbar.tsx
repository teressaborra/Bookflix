import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, LogOut, User as UserIcon, Crown, Calendar, ChevronDown } from 'lucide-react';

const Navbar = ({ transparent = false }: { transparent?: boolean }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setShowUserMenu(false);
    };

    return (
        <nav className={`${transparent
                ? 'absolute top-0 left-0 right-0 bg-transparent border-none'
                : 'bg-dark/95 backdrop-blur-sm border-b border-white/10 sticky top-0'
            } z-50 transition-all duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Film className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
                        <span className="text-2xl font-heading font-bold tracking-wider text-white">
                            BOOK<span className="text-primary">FLIX</span>
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">Movies</Link>
                        <Link to="/theaters" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">Theaters</Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors uppercase tracking-widest">Admin Panel</Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors p-2 rounded-lg hover:bg-white/5"
                                >
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline">{user.name}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-xl border border-white/10 py-2 z-50">
                                        <Link
                                            to="/profile/bookings"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                                        >
                                            <Calendar className="w-4 h-4" />
                                            My Bookings
                                        </Link>
                                        <Link
                                            to="/profile/loyalty"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors"
                                        >
                                            <Crown className="w-4 h-4 text-yellow-400" />
                                            Loyalty Rewards
                                        </Link>
                                        <div className="border-t border-white/10 my-2"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors w-full text-left text-red-400"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary py-2 px-6 text-sm">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
