import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoyaltyDashboard from '../components/LoyaltyDashboard';
import { Crown, ArrowLeft } from 'lucide-react';

const LoyaltyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-dark py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Go Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>

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