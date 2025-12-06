import React from 'react';
import Hero from '../components/Hero';
import { useAuth } from '../context/AuthContext';

const HomeSimple = () => {
    const { user } = useAuth();

    return (
        <div>
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-white mb-8">Welcome to Bookflix!</h2>
                {user ? (
                    <p className="text-gray-300">Hello, {user.name}! All features are now available.</p>
                ) : (
                    <p className="text-gray-300">Please login to access all features.</p>
                )}
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">🎬 Smart Features</h3>
                        <ul className="text-gray-300 space-y-2">
                            <li>• AI-powered seat recommendations</li>
                            <li>• Dynamic pricing system</li>
                            <li>• Personalized movie suggestions</li>
                        </ul>
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">🎁 Loyalty System</h3>
                        <ul className="text-gray-300 space-y-2">
                            <li>• Earn points on every booking</li>
                            <li>• 4-tier membership system</li>
                            <li>• Exclusive benefits and rewards</li>
                        </ul>
                    </div>
                    
                    <div className="bg-card p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">⭐ Social Features</h3>
                        <ul className="text-gray-300 space-y-2">
                            <li>• Movie reviews and ratings</li>
                            <li>• Group booking system</li>
                            <li>• Community recommendations</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSimple;