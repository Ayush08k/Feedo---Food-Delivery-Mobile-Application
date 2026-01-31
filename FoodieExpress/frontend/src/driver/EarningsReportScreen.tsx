import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 32; // padding
const CHART_HEIGHT = 200;
const BAR_WIDTH = 45;

interface EarningsData {
    period: string;
    totalEarnings: number;
    deliveries: number;
    avgPerDelivery: number;
    tips: number;
    breakdown: {
        date: string;
        deliveries: number;
        earnings: number;
        tips: number;
    }[];
}

export default function EarningsReportScreen() {
    const navigation = useNavigation<any>();
    const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'prevMonth' | 'year' | 'overall'>('month');

    const earningsData: Record<string, EarningsData> = {
        month: {
            period: 'January 2026',
            totalEarnings: 1287.50,
            deliveries: 89,
            avgPerDelivery: 14.47,
            tips: 245.00,
            breakdown: [
                { date: 'Jan 27', deliveries: 11, earnings: 82.75, tips: 17.50 },
                { date: 'Jan 28', deliveries: 14, earnings: 95.50, tips: 20.00 },
                { date: 'Jan 29', deliveries: 10, earnings: 78.00, tips: 15.00 },
                { date: 'Jan 30', deliveries: 15, earnings: 112.25, tips: 22.50 },
                { date: 'Jan 31', deliveries: 12, earnings: 87.50, tips: 18.00 },
            ]
        },
        prevMonth: {
            period: 'December 2025',
            totalEarnings: 1450.75,
            deliveries: 95,
            avgPerDelivery: 15.27,
            tips: 285.00,
            breakdown: [
                { date: 'Dec 27', deliveries: 14, earnings: 98.00, tips: 24.00 },
                { date: 'Dec 28', deliveries: 13, earnings: 88.50, tips: 19.50 },
                { date: 'Dec 29', deliveries: 12, earnings: 95.00, tips: 22.00 },
                { date: 'Dec 30', deliveries: 16, earnings: 128.00, tips: 28.00 },
                { date: 'Dec 31', deliveries: 18, earnings: 145.50, tips: 35.00 },
            ]
        },
        year: {
            period: '2026',
            totalEarnings: 1287.50,
            deliveries: 89,
            avgPerDelivery: 14.47,
            tips: 245.00,
            breakdown: [
                { date: 'January', deliveries: 89, earnings: 1042.50, tips: 245.00 },
            ]
        },
        overall: {
            period: 'All Time',
            totalEarnings: 8540.00,
            deliveries: 542,
            avgPerDelivery: 15.76,
            tips: 1340.00,
            breakdown: [
                { date: '2024', deliveries: 195, earnings: 2890.00, tips: 410.00 },
                { date: '2025', deliveries: 258, earnings: 3607.50, tips: 685.00 },
                { date: '2026', deliveries: 89, earnings: 1042.50, tips: 245.00 },
            ]
        },
    };

    const data = earningsData[selectedPeriod];
    const maxEarnings = Math.max(...data.breakdown.map(d => d.earnings + d.tips));

    const periods = [
        { key: 'month' as const, label: 'This Month' },
        { key: 'prevMonth' as const, label: 'Previous Month' },
        { key: 'year' as const, label: 'This Year' },
        { key: 'overall' as const, label: 'Overall' },
    ];

    const renderOverview = () => {
        return (
            <View className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333] mb-6">
                <Text className="text-white text-lg font-bold mb-4">Earnings Breakdown</Text>

                {data.breakdown.map((item, index) => {
                    const totalAmount = item.earnings + item.tips;
                    const earningsPercentage = (item.earnings / totalAmount) * 100;
                    const tipsPercentage = (item.tips / totalAmount) * 100;

                    return (
                        <View key={index} className="mb-4 pb-4 border-b border-[#333]">
                            {/* Date and Amount Header */}
                            <View className="flex-row justify-between items-center mb-2">
                                <Text className="text-white font-bold">{item.date}</Text>
                                <Text className="text-[#1DB954] font-bold text-lg">
                                    ${totalAmount.toFixed(2)}
                                </Text>
                            </View>

                            {/* Progress Bar */}
                            <View className="h-2 bg-[#121212] rounded-full overflow-hidden flex-row mb-2">
                                <View
                                    className="bg-[#1DB954] h-full"
                                    style={{ width: `${earningsPercentage}%` }}
                                />
                                <View
                                    className="bg-[#FFD93D] h-full"
                                    style={{ width: `${tipsPercentage}%` }}
                                />
                            </View>

                            {/* Stats Row */}
                            <View className="flex-row justify-between">
                                <View className="flex-row items-center space-x-4">
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 bg-[#1DB954] rounded-full mr-1" />
                                        <Text className="text-[#A0A0A0] text-xs">
                                            Base ${item.earnings.toFixed(2)}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <View className="w-2 h-2 bg-[#FFD93D] rounded-full mr-1" />
                                        <Text className="text-[#A0A0A0] text-xs">
                                            Tips ${item.tips.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-[#666] text-xs">
                                    {item.deliveries} deliveries
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        );
    };

    const renderStatsCard = (title: string, value: string, subtitle: string, color: string = '#1DB954') => (
        <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
            <Text className="text-[#A0A0A0] text-xs uppercase font-bold mb-1">{title}</Text>
            <Text className="font-bold text-2xl mb-1" style={{ color }}>{value}</Text>
            <Text className="text-[#666] text-xs">{subtitle}</Text>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="mr-4 p-2 rounded-full bg-[#1E1E1E]"
                        >
                            <Text className="text-white">←</Text>
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white text-2xl font-bold">Earnings Report</Text>
                            <Text className="text-[#A0A0A0] text-sm">{data.period}</Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-[#1DB954] px-4 py-2 rounded-full">
                        <Text className="text-black font-bold">📄 Export</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Period Filter */}
            <View className="px-4 pt-4 pb-2 bg-[#121212]">
                <View className="flex-row gap-2">
                    {periods.map((period) => (
                        <TouchableOpacity
                            key={period.key}
                            className={`flex-1 py-3 px-2 rounded-xl border-2 ${selectedPeriod === period.key
                                ? 'bg-[#1DB954] border-[#1DB954]'
                                : 'bg-[#1E1E1E] border-[#333]'
                                }`}
                            onPress={() => setSelectedPeriod(period.key)}
                        >
                            <Text
                                className={`text-center font-bold text-xs ${selectedPeriod === period.key ? 'text-black' : 'text-white'
                                    }`}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {period.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Main Stats */}
                <View className="py-6">
                    <View className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#333] mb-4">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold mb-2">Total Earnings</Text>
                        <Text className="text-[#1DB954] text-5xl font-bold mb-4">${data.totalEarnings.toFixed(2)}</Text>

                        {/* Progress Bar */}
                        <View className="mb-4">
                            <View className="h-3 bg-[#121212] rounded-full overflow-hidden flex-row">
                                <View
                                    className="bg-[#1DB954] h-full"
                                    style={{ width: `${((data.totalEarnings - data.tips) / data.totalEarnings) * 100}%` }}
                                />
                                <View
                                    className="bg-[#FFD93D] h-full"
                                    style={{ width: `${(data.tips / data.totalEarnings) * 100}%` }}
                                />
                            </View>
                            <View className="flex-row justify-between mt-2">
                                <Text className="text-[#666] text-xs">Base: ${(data.totalEarnings - data.tips).toFixed(2)}</Text>
                                <Text className="text-[#666] text-xs">Tips: ${data.tips.toFixed(2)}</Text>
                            </View>
                        </View>

                        <View className="flex-row space-x-3">
                            <View className="flex-1 bg-[#121212] p-3 rounded-lg">
                                <Text className="text-[#666] text-xs">Deliveries</Text>
                                <Text className="text-white font-bold text-xl">{data.deliveries}</Text>
                            </View>
                            <View className="flex-1 bg-[#121212] p-3 rounded-lg">
                                <Text className="text-[#666] text-xs">Avg/Delivery</Text>
                                <Text className="text-white font-bold text-xl">${data.avgPerDelivery.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Overview */}
                {renderOverview()}

                {/* Quick Stats Grid */}
                <View className="mb-6">
                    <Text className="text-white text-xl font-bold mb-4">Performance Metrics</Text>
                    <View className="flex-row space-x-4 mb-3">
                        {renderStatsCard(
                            'Best Day',
                            `$${Math.max(...data.breakdown.map(d => d.earnings + d.tips)).toFixed(0)}`,
                            data.breakdown.find(d => (d.earnings + d.tips) === Math.max(...data.breakdown.map(i => i.earnings + i.tips)))?.date || '',
                            '#1DB954'
                        )}
                        {renderStatsCard(
                            'Total Tips',
                            `$${data.tips.toFixed(0)}`,
                            `${((data.tips / data.totalEarnings) * 100).toFixed(0)}% of total`,
                            '#FFD93D'
                        )}
                    </View>
                    <View className="flex-row space-x-4">
                        {renderStatsCard(
                            'Avg Tips',
                            `$${(data.tips / data.deliveries).toFixed(2)}`,
                            'Per delivery',
                            '#A0A0A0'
                        )}
                        {renderStatsCard(
                            'Daily Avg',
                            `$${(data.totalEarnings / data.breakdown.length).toFixed(0)}`,
                            `${(data.deliveries / data.breakdown.length).toFixed(0)} deliveries/day`,
                            '#A0A0A0'
                        )}
                    </View>
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
