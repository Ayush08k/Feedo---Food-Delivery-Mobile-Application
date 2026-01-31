import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBarComponent from '../utils/SearchBarComponent';
import AnalyticsCard from '../utils/AnalyticsCard';
import OfferCard from '../utils/OfferCard';
import { getSearchHistory, saveSearchQuery, clearSearchHistory } from '../utils/searchHistoryUtils';

const { width } = Dimensions.get('window');

export default function RestaurantHomeScreen() {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);

    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        const history = await getSearchHistory();
        setSearchHistory(history);
    };

    const handleSearch = async () => {
        if (searchQuery.trim().length >= 2) {
            await saveSearchQuery(searchQuery);
            await loadSearchHistory();
            // Navigate to search results or filter orders/menu
        }
    };

    const handleClearHistory = async () => {
        await clearSearchHistory();
        setSearchHistory([]);
    };

    const todayOrders = [
        { id: 101, items: ['Burger x2', 'Fries'], status: 'PENDING', total: 25.50, time: '10 mins ago' },
        { id: 102, items: ['Pizza Margherita'], status: 'PREPARING', total: 12.99, time: '15 mins ago' },
        { id: 103, items: ['Pasta x1', 'Coke'], status: 'READY', total: 18.50, time: '20 mins ago' },
    ];

    const activeOffers = [
        { id: 1, title: '30% OFF', description: 'Happy Hour Special', color: '#FF6B6B' },
        { id: 2, title: 'Free Delivery', description: 'Orders above $20', color: '#1DB954' },
        { id: 3, title: 'Buy 1 Get 1', description: 'On selected items', color: '#FFD93D' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row justify-between items-center mb-2">
                    <View>
                        <Text className="text-white text-2xl font-bold">Restaurant Dashboard</Text>
                        <Text className="text-[#1DB954]">● Open for Orders</Text>
                    </View>
                    <TouchableOpacity
                        className="bg-[#1E1E1E] p-2 rounded-full"
                        onPress={() => navigation.navigate('RestaurantProfile')}
                    >
                        <Text>⚙️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-4">
                <SearchBarComponent
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search orders, menu items..."
                    onSubmit={handleSearch}
                    recentSearches={searchHistory}
                    onRecentSearchPress={(search) => setSearchQuery(search)}
                    onClearHistory={handleClearHistory}
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Analytics Cards */}
                <View className="px-4 mb-6">
                    <Text className="text-white text-xl font-bold mb-4">Today's Overview</Text>
                    <View className="flex-row mb-4 space-x-4">
                        <AnalyticsCard
                            title="Revenue"
                            value="$342.50"
                            subtitle="25 orders"
                            icon="💰"
                            trend="up"
                            trendValue="+15%"
                            color="#1DB954"
                        />
                        <AnalyticsCard
                            title="Orders"
                            value="25"
                            subtitle="3 pending"
                            icon="📦"
                            trend="up"
                            trendValue="+8"
                            color="#FFD93D"
                        />
                    </View>
                    <View className="flex-row space-x-4">
                        <AnalyticsCard
                            title="Avg Order"
                            value="$13.70"
                            icon="📊"
                            trend="neutral"
                            trendValue="+$0.50"
                        />
                        <AnalyticsCard
                            title="Rating"
                            value="4.8"
                            subtitle="128 reviews"
                            icon="⭐"
                            trend="up"
                            trendValue="+0.2"
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
                            onPress={() => navigation.navigate('MenuManagement')}
                        >
                            <Text className="text-3xl mb-2">📋</Text>
                            <Text className="text-white font-semibold">Manage Menu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] items-center mb-4"
                            style={{ width: (width - 48) / 2 }}
                            onPress={() => navigation.navigate('RestaurantOffers')}
                        >
                            <Text className="text-3xl mb-2">🎁</Text>
                            <Text className="text-white font-semibold">Offers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] items-center mr-4 mb-4"
                            style={{ width: (width - 48) / 2 }}
                            onPress={() => navigation.navigate('OrderHistory')}
                        >
                            <Text className="text-3xl mb-2">📜</Text>
                            <Text className="text-white font-semibold">Order History</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] items-center mb-4"
                            style={{ width: (width - 48) / 2 }}
                        >
                            <Text className="text-3xl mb-2">📊</Text>
                            <Text className="text-white font-semibold">Analytics</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Active Offers */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center px-4 mb-4">
                        <Text className="text-white text-xl font-bold">Active Offers</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('RestaurantOffers')}>
                            <Text className="text-[#1DB954]">Manage →</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {activeOffers.map((offer) => (
                            <OfferCard
                                key={offer.id}
                                title={offer.title}
                                description={offer.description}
                                color={offer.color}
                                onPress={() => navigation.navigate('RestaurantOffers')}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Recent Orders */}
                <View className="px-4 pb-20">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white text-xl font-bold">Recent Orders</Text>
                        <TouchableOpacity>
                            <Text className="text-[#1DB954]">See All →</Text>
                        </TouchableOpacity>
                    </View>
                    {todayOrders.map(order => (
                        <View key={order.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-white font-bold text-lg">Order #{order.id}</Text>
                                <Text className="text-[#1DB954] font-bold text-lg">${order.total.toFixed(2)}</Text>
                            </View>
                            <View className="mb-3">
                                {order.items.map((item, idx) => (
                                    <Text key={idx} className="text-[#A0A0A0]">• {item}</Text>
                                ))}
                            </View>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-[#666] text-xs">{order.time}</Text>
                                <View
                                    className="px-3 py-1 rounded-full"
                                    style={{
                                        backgroundColor: order.status === 'READY' ? '#1DB95420' : order.status === 'PREPARING' ? '#FFD93D20' : '#FF6B6B20',
                                        borderColor: order.status === 'READY' ? '#1DB954' : order.status === 'PREPARING' ? '#FFD93D' : '#FF6B6B',
                                        borderWidth: 1
                                    }}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{ color: order.status === 'READY' ? '#1DB954' : order.status === 'PREPARING' ? '#FFD93D' : '#FF6B6B' }}
                                    >
                                        {order.status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
