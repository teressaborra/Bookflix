import React from 'react';
import LoyaltyDashboard from '../components/LoyaltyDashboard';
import { Crown } from 'lucide-react';

const LoyaltyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-dark py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Crown className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-heading">Loyalty Rewards</h1>
                    </div>
                    <p className="text-muted text-lg">
                        Earn points with every booking and unlock exclusive benefits as you climb the tiers.
                    </p>
                </div>

                <LoyaltyDashboard />
            </div>
        </div>
    );
};

export default LoyaltyPage;