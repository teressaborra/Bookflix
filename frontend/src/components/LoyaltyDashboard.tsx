import React, { useState, useEffect } from 'react';
import { loyaltyApi } from '../api/services';
import type { UserPoints, TierBenefits } from '../types';
import { Crown, Star, Gift, Zap, Trophy, Coins } from 'lucide-react';

const LoyaltyDashboard: React.FC = () => {
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [tierBenefits, setTierBenefits] = useState<TierBenefits | null>(null);
    const [loading, setLoading] = useState(true);
    const [redeemAmount, setRedeemAmount] = useState('');
    const [redeeming, setRedeeming] = useState(false);

    useEffect(() => {
        loadLoyaltyData();
    }, []);

    const loadLoyaltyData = async () => {
        try {
            const [pointsRes, benefitsRes] = await Promise.all([
                loyaltyApi.getUserPoints(),
                loyaltyApi.getTierBenefits()
            ]);
            setUserPoints(pointsRes.data);
            setTierBenefits(benefitsRes.data);
        } catch (error) {
            console.error('Error loading loyalty data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemPoints = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!redeemAmount || redeeming) return;

        const points = parseInt(redeemAmount);
        if (points <= 0 || points > (userPoints?.availablePoints || 0)) return;

        setRedeeming(true);
        try {
            await loyaltyApi.redeemPoints(points);
            setRedeemAmount('');
            loadLoyaltyData(); // Reload data
        } catch (error) {
            console.error('Error redeeming points:', error);
        } finally {
            setRedeeming(false);
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Bronze': return 'text-amber-600';
            case 'Silver': return 'text-gray-400';
            case 'Gold': return 'text-yellow-400';
            case 'Platinum': return 'text-purple-400';
            default: return 'text-gray-400';
        }
    };

    const getTierIcon = (tier: string) => {
        switch (tier) {
            case 'Bronze': return <Trophy className="w-6 h-6" />;
            case 'Silver': return <Star className="w-6 h-6" />;
            case 'Gold': return <Crown className="w-6 h-6" />;
            case 'Platinum': return <Zap className="w-6 h-6" />;
            default: return <Trophy className="w-6 h-6" />;
        }
    };

    const getNextTierRequirement = (currentTier: string, totalSpent: number) => {
        const requirements = {
            'Bronze': { next: 'Silver', amount: 200 },
            'Silver': { next: 'Gold', amount: 500 },
            'Gold': { next: 'Platinum', amount: 1000 },
            'Platinum': { next: null, amount: 0 }
        };

        const req = requirements[currentTier as keyof typeof requirements];
        if (!req.next) return null;

        return {
            nextTier: req.next,
            remaining: req.amount - totalSpent,
            progress: (totalSpent / req.amount) * 100
        };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!userPoints || !tierBenefits) {
        return <div className="text-center text-red-500">Error loading loyalty data</div>;
    }

    const nextTier = getNextTierRequirement(userPoints.tier, userPoints.totalSpent);

    return (
        <div className="space-y-6">
            {/* Tier Status Card */}
            <div className="bg-gradient-to-r from-card to-dark rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`${getTierColor(userPoints.tier)}`}>
                            {getTierIcon(userPoints.tier)}
                        </div>
                        <div>
                            <h3 className="text-xl font-heading">{userPoints.tier} Member</h3>
                            <p className="text-muted">Since {new Date(userPoints.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{userPoints.availablePoints}</div>
                        <div className="text-sm text-muted">Available Points</div>
                    </div>
                </div>

                {/* Progress to Next Tier */}
                {nextTier && (
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Progress to {nextTier.nextTier}</span>
                            <span>${nextTier.remaining.toFixed(2)} remaining</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary to-yellow-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(nextTier.progress, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Points Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card rounded-lg p-4 text-center">
                    <Coins className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userPoints.totalPoints}</div>
                    <div className="text-sm text-muted">Total Earned</div>
                </div>

                <div className="bg-card rounded-lg p-4 text-center">
                    <Gift className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{userPoints.totalBookings}</div>
                    <div className="text-sm text-muted">Total Bookings</div>
                </div>

                <div className="bg-card rounded-lg p-4 text-center">
                    <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold">${userPoints.totalSpent.toFixed(2)}</div>
                    <div className="text-sm text-muted">Total Spent</div>
                </div>
            </div>

            {/* Tier Benefits */}
            <div className="bg-card rounded-lg p-6">
                <h4 className="text-lg font-heading mb-4">Your {userPoints.tier} Benefits</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-dark/50 rounded">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <div>
                            <div className="font-medium">{tierBenefits.pointsMultiplier}x Points Multiplier</div>
                            <div className="text-sm text-muted">Earn more points on every booking</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-dark/50 rounded">
                        <Crown className="w-5 h-5 text-purple-400" />
                        <div>
                            <div className="font-medium">{tierBenefits.freeUpgrades} Free Upgrades</div>
                            <div className="text-sm text-muted">Per month to premium seats</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-dark/50 rounded">
                        <Gift className="w-5 h-5 text-green-400" />
                        <div>
                            <div className="font-medium">{tierBenefits.birthdayBonus} Birthday Bonus</div>
                            <div className="text-sm text-muted">Extra points on your birthday</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-dark/50 rounded">
                        <Star className="w-5 h-5 text-blue-400" />
                        <div>
                            <div className="font-medium">
                                {tierBenefits.earlyBooking ? 'Early Booking Access' : 'Standard Booking'}
                            </div>
                            <div className="text-sm text-muted">
                                {tierBenefits.earlyBooking ? 'Book tickets before general release' : 'Regular booking access'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Redeem Points */}
            <div className="bg-card rounded-lg p-6">
                <h4 className="text-lg font-heading mb-4">Redeem Points</h4>
                <p className="text-muted mb-4">1 point = $0.01 discount on your next booking</p>

                <form onSubmit={handleRedeemPoints} className="flex gap-3">
                    <input
                        type="number"
                        value={redeemAmount}
                        onChange={(e) => setRedeemAmount(e.target.value)}
                        placeholder="Enter points to redeem"
                        min="1"
                        max={userPoints.availablePoints}
                        className="input-field flex-1"
                    />
                    <button
                        type="submit"
                        disabled={redeeming || !redeemAmount || parseInt(redeemAmount) > userPoints.availablePoints}
                        className="btn-primary disabled:opacity-50"
                    >
                        {redeeming ? 'Redeeming...' : 'Redeem'}
                    </button>
                </form>

                {redeemAmount && parseInt(redeemAmount) > 0 && (
                    <div className="mt-3 text-sm text-green-400">
                        You'll get ${(parseInt(redeemAmount) * 0.01).toFixed(2)} discount
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoyaltyDashboard;