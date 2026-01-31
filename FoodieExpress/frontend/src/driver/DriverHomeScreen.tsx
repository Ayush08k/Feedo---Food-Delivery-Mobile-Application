import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AnalyticsCard from '../utils/AnalyticsCard';

const { width } = Dimensions.get('window');

export default function DriverHomeScreen() {
    const navigation = useNavigation<any>();
    const [isOnline, setIsOnline] = useState(false);

    const todayStats = {
        earnings: 87.50,
        deliveries: 12,
        onTimePercent: 95,
        rating: 4.9
    };

    const availableOrders = [
        { id: 201, restaurant: 'Burger King', address: '456 Wall St', distance: '2.3 km', fee: 5.50, time: '15-20 min' },
        { id: 202, restaurant: 'Pizza Hut', address: '789 Oak Ave', distance: '1.8 km', fee: 4.75, time: '10-15 min' },
    ];

    const recentDeliveries = [
        { id: 101, restaurant: 'Sushi Master', earnings: 6.50, rating: 5, time: '45 mins ago' },
        { id: 102, restaurant: 'Taco Bell', earnings: 5.00, rating: 4, time: '1 hour ago' },
        { id: 103, restaurant: 'KFC', earnings: 7.25, rating: 5, time: '2 hours ago' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                        <Text className="text-white text-2xl font-bold">Driver Dashboard</Text>
                        <Text className={isOnline ? "text-[#1DB954]" : "text-[#A0A0A0]"}>
                            {isOnline ? '● Online' : '○ Offline'}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-2 rounded-full mr-3"
                            onPress={() => navigation.navigate('DriverProfile')}
                        >
                            <Text>⚙️</Text>
                        </TouchableOpacity>
                        <Switch
                            trackColor={{ false: "#333", true: "#1DB954" }}
                            thumbColor={isOnline ? "#fff" : "#f4f3f4"}
                            onValueChange={() => setIsOnline(!isOnline)}
                            value={isOnline}
                        />
                    </View>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Today's Earnings & Stats */}
                <View className="px-4 py-6">
                    <Text className="text-white text-xl font-bold mb-4">Today's Performance</Text>
                    <View className="flex-row mb-4 space-x-4">
                        <AnalyticsCard
                            title="Earnings"
                            value={`$${todayStats.earnings.toFixed(2)}`}
                            subtitle={`${todayStats.deliveries} deliveries`}
                            icon="💰"
                            trend="up"
                            trendValue="+12%"
                            color="#1DB954"
                        />
                        <AnalyticsCard
                            title="Deliveries"
                            value={todayStats.deliveries}
                            subtitle="Completed"
                            icon="📦"
                            trend="up"
                            trendValue="+3"
                            color="#FFD93D"
                        />
                    </View>
                    <View className="flex-row space-x-4">
                        <AnalyticsCard
                            title="On-Time %"
                            value={`${todayStats.onTimePercent}%`}
                            icon="⏱️"
                            trend="up"
                            trendValue="+2%"
                        />
                        <AnalyticsCard
                            title="Rating"
                            value={todayStats.rating}
                            subtitle="348 reviews"
                            icon="⭐"
                            trend="neutral"
                            trendValue="+0.1"
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-4 mb-6">
                    <Text className="text-white text-xl font-bold mb-4">Quick Actions</Text>
                    <View className="flex-row flex-wrap">
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] items-center mr-4 mb-4"
                            style={{ width: (width - 48) / 2 }}
                            onPress={() => navigation.navigate('AvailableOrders')}
                        >
                            <Text className="text-3xl mb-2">📋</Text>
                            <Text className="text-white font-semibold">Available Orders</Text>
                            <View className="mt-1 bg-[#1DB954] px-2 py-1 rounded-full">
                                <Text className="text-black text-xs font-bold">{availableOrders.length} new</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] items-center mb-4"
                            style={{ width: (width - 48) / 2 }}
                            onPress={() => navigation.navigate('DeliveryHistory')}
                        >
                            <Text className="text-3xl mb-2">📜</Text>
                            <Text className="text-white font-semibold">History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] items-center mr-4 mb-4"
                            style={{ width: (width - 48) / 2 }}
                        >
                            <Text className="text-3xl mb-2">📊</Text>
                            <Text className="text-white font-semibold">Analytics</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] items-center mb-4"
                            style={{ width: (width - 48) / 2 }}
                            onPress={() => navigation.navigate('DriverProfile')}
                        >
                            <Text className="text-3xl mb-2">👤</Text>
                            <Text className="text-white font-semibold">Profile</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Available Orders Preview */}
                {isOnline && availableOrders.length > 0 && (
                    <View className="px-4 mb-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-white text-xl font-bold">Available Orders</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('AvailableOrders')}>
                                <Text className="text-[#1DB954]">See All →</Text>
                            </TouchableOpacity>
                        </View>
                        {availableOrders.slice(0, 2).map(order => (
                            <View key={order.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-3">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-white font-bold text-lg">{order.restaurant}</Text>
                                    <Text className="text-[#1DB954] font-bold text-lg">${order.fee.toFixed(2)}</Text>
                                </View>
                                <Text className="text-[#A0A0A0] mb-1">📍 {order.address}</Text>
                                <View className="flex-row justify-between items-center">
                                    <View className="flex-row space-x-3">
                                        <Text className="text-[#666] text-xs">🚗 {order.distance}</Text>
                                        <Text className="text-[#666] text-xs">⏱️ {order.time}</Text>
                                    </View>
                                    <TouchableOpacity
                                        className="bg-[#1DB954] px-4 py-2 rounded-lg"
                                        onPress={() => navigation.navigate('DriverDelivery')}
                                    >
                                        <Text className="text-black font-bold text-sm">Accept</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Offline State */}
                {!isOnline && (
                    <View className="items-center justify-center py-12 px-4">
                        <Text className="text-6xl mb-4">😴</Text>
                        <Text className="text-[#A0A0A0] text-lg text-center mb-2">You're currently offline</Text>
                        <Text className="text-[#666] text-center mb-6">
                            Toggle the switch above to go online and start receiving delivery requests
                        </Text>
                    </View>
                )}

                {/* Recent Deliveries */}
                <View className="px-4 pb-20">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-xl font-bold">Recent Deliveries</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('DeliveryHistory')}>
                            <Text className="text-[#1DB954]">See All →</Text>
                        </TouchableOpacity>
                    </View>
                    {recentDeliveries.map(delivery => (
                        <View key={delivery.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-3">
                            <View className="flex-row justify-between items-center">
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-base mb-1">{delivery.restaurant}</Text>
                                    <Text className="text-[#666] text-xs">{delivery.time}</Text>
                                </View>
                                <View className="items-end">
                                    <Text className="text-[#1DB954] font-bold text-lg">+${delivery.earnings.toFixed(2)}</Text>
                                    <View className="flex-row items-center mt-1">
                                        <Text className="text-[#FFD93D] mr-1">★</Text>
                                        <Text className="text-white text-sm">{delivery.rating}.0</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
