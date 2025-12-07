import React, { useState, useEffect } from 'react';
import { pricingApi } from '../api/services';
import type { PricingInfo } from '../types';
import { TrendingUp, TrendingDown, Clock, Users, Zap, AlertCircle } from 'lucide-react';

interface DynamicPricingProps {
    showId: number;
    onPriceUpdate?: (price: number) => void;
}

const DynamicPricing: React.FC<DynamicPricingProps> = ({ showId, onPriceUpdate }) => {
    const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    const formatPrice = (price: any): string => {
        try {
            const numPrice = Number(price);
            if (isNaN(numPrice)) {
                return '0.00';
            }
            return numPrice.toFixed(2);
        } catch (error) {
            return '0.00';
        }
    };

    const formatPercentage = (value: any, decimals: number = 1): string => {
        try {
            const numValue = Number(value);
            if (isNaN(numValue)) {
                return '0.0';
            }
            return numValue.toFixed(decimals);
        } catch (error) {
            return '0.0';
        }
    };

    useEffect(() => {
        loadPricingInfo();

        // Auto-refresh pricing every 30 seconds
        const interval = setInterval(loadPricingInfo, 30000);
        return () => clearInterval(interval);
    }, [showId]);

    const loadPricingInfo = async () => {
        try {
            const response = await pricingApi.getShowPricing(showId);
            setPricingInfo(response.data);
            setLastUpdate(new Date());

            if (onPriceUpdate) {
                onPriceUpdate(Number(response.data.currentPrice) || 0);
            }
        } catch (error) {
            console.error('Error loading pricing info:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPriceChangeIndicator = () => {
        if (!pricingInfo) return null;

        const currentPrice = Number(pricingInfo.currentPrice) || 0;
        const basePrice = Number(pricingInfo.basePrice) || 0;
        const change = currentPrice - basePrice;
        const changePercent = basePrice > 0 ? ((change / basePrice) * 100) : 0;

        if (Math.abs(changePercent) < 1) {
            return (
                <div className="flex items-center gap-1 text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-sm">Stable</span>
                </div>
            );
        }

        return change > 0 ? (
            <div className="flex items-center gap-1 text-red-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{formatPercentage(changePercent)}%</span>
            </div>
        ) : (
            <div className="flex items-center gap-1 text-green-400">
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm">{formatPercentage(changePercent)}%</span>
            </div>
        );
    };

    const getDemandLevel = (occupancyRate: number) => {
        if (occupancyRate >= 0.8) return { level: 'Very High', color: 'text-red-400', bg: 'bg-red-400/20' };
        if (occupancyRate >= 0.6) return { level: 'High', color: 'text-orange-400', bg: 'bg-orange-400/20' };
        if (occupancyRate >= 0.4) return { level: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-400/20' };
        if (occupancyRate >= 0.2) return { level: 'Low', color: 'text-green-400', bg: 'bg-green-400/20' };
        return { level: 'Very Low', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    };

    const getPricingFactors = () => {
        if (!pricingInfo) return [];

        const factors = [];
        const occupancyRate = pricingInfo.occupancyRate;

        if (occupancyRate > 0.8) {
            factors.push({ icon: Users, text: 'High demand (80%+ full)', impact: 'Increases price' });
        } else if (occupancyRate < 0.2) {
            factors.push({ icon: Users, text: 'Low demand (<20% full)', impact: 'Reduces price' });
        }

        // Check if it's a weekend (this would need show date info)
        const now = new Date();
        const isWeekend = now.getDay() === 0 || now.getDay() === 6;
        if (isWeekend) {
            factors.push({ icon: Clock, text: 'Weekend premium', impact: 'Increases price' });
        }

        // Check if it's prime time (6-10 PM)
        const hour = now.getHours();
        if (hour >= 18 && hour <= 22) {
            factors.push({ icon: Zap, text: 'Prime time (6-10 PM)', impact: 'Increases price' });
        }

        return factors;
    };

    if (loading) {
        return (
            <div className="bg-card rounded-lg p-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                    <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!pricingInfo) {
        return (
            <div className="bg-card rounded-lg p-4 text-center text-red-400">
                <AlertCircle className="w-6 h-6 mx-auto mb-2" />
                <p>Unable to load pricing information</p>
            </div>
        );
    }

    const demand = getDemandLevel(pricingInfo.occupancyRate);
    const pricingFactors = getPricingFactors();

    return (
        <div className="bg-card rounded-lg p-6 space-y-4">
            {/* Current Price Display */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-muted mb-1">Current Price</div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold text-primary">
                            ${formatPrice(pricingInfo.currentPrice)}
                        </span>
                        {getPriceChangeIndicator()}
                    </div>
                    {(Number(pricingInfo.currentPrice) || 0) !== (Number(pricingInfo.basePrice) || 0) && (
                        <div className="text-sm text-muted">
                            Base price: ${formatPrice(pricingInfo.basePrice)}
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${demand.bg} ${demand.color}`}>
                        <Users className="w-4 h-4" />
                        {demand.level} Demand
                    </div>
                    <div className="text-xs text-muted mt-1">
                        {formatPercentage(pricingInfo.occupancyRate * 100)}% full
                    </div>
                </div>
            </div>

            {/* Demand Visualization */}
            <div>
                <div className="flex justify-between text-sm mb-2">
                    <span>Seat Availability</span>
                    <span>{formatPercentage(pricingInfo.occupancyRate * 100)}% booked</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ${pricingInfo.occupancyRate >= 0.8 ? 'bg-red-400' :
                                pricingInfo.occupancyRate >= 0.6 ? 'bg-orange-400' :
                                    pricingInfo.occupancyRate >= 0.4 ? 'bg-yellow-400' :
                                        'bg-green-400'
                            }`}
                        style={{ width: `${pricingInfo.occupancyRate * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Pricing Factors */}
            {pricingFactors.length > 0 && (
                <div>
                    <div className="text-sm font-medium mb-2">Pricing Factors</div>
                    <div className="space-y-2">
                        {pricingFactors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                                <factor.icon className="w-4 h-4 text-muted" />
                                <span className="flex-1">{factor.text}</span>
                                <span className={`text-xs ${factor.impact.includes('Increases') ? 'text-red-400' : 'text-green-400'
                                    }`}>
                                    {factor.impact}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Last Update */}
            <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-white/10">
                <span>Price updates automatically</span>
                <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>

            {/* Price Alert */}
            {pricingInfo.occupancyRate > 0.7 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-400">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">High Demand Alert</span>
                    </div>
                    <p className="text-sm text-muted mt-1">
                        This show is filling up fast! Prices may increase as more seats are booked.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DynamicPricing;