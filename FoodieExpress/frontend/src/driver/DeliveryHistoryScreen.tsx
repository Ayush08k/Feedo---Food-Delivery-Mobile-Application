import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBarComponent from '../utils/SearchBarComponent';
import { getSearchHistory, saveSearchQuery, clearSearchHistory } from '../utils/searchHistoryUtils';

interface Delivery {
    id: number;
    restaurant: string;
    deliveryAddress: string;
    date: string;
    time: string;
    earnings: number;
    tip: number;
    distance: string;
    rating: number;
    status: 'completed' | 'cancelled';
}

export default function DeliveryHistoryScreen() {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'cancelled'>('all');

    useEffect(() => {
        loadSearchHistory();
    }, []);

    const loadSearchHistory = async () => {
        const history = await getSearchHistory();
        setSearchHistory(history);
    };

    const handleClearHistory = async () => {
        await clearSearchHistory();
        setSearchHistory([]);
    };

    const [deliveries, setDeliveries] = useState<Delivery[]>([
        { id: 101, restaurant: 'Sushi Master', deliveryAddress: '123 Main St', date: '2026-01-31', time: '14:30', earnings: 6.50, tip: 3.00, distance: '2.5 km', rating: 5, status: 'completed' },
        { id: 102, restaurant: 'Taco Bell', deliveryAddress: '456 Oak Ave', date: '2026-01-31', time: '12:15', earnings: 5.00, tip: 2.50, distance: '1.8 km', rating: 4, status: 'completed' },
        { id: 103, restaurant: 'KFC', deliveryAddress: '789 Pine Rd', date: '2026-01-31', time: '11:00', earnings: 7.25, tip: 4.00, distance: '3.2 km', rating: 5, status: 'completed' },
        { id: 104, restaurant: 'Pizza Hut', deliveryAddress: '321 Elm St', date: '2026-01-30', time: '19:45', earnings: 5.75, tip: 0, distance: '2.1 km', rating: 3, status: 'completed' },
        { id: 105, restaurant: 'Burger King', deliveryAddress: '555 Beach Blvd', date: '2026-01-30', time: '18:30', earnings: 0, tip: 0, distance: '1.5 km', rating: 0, status: 'cancelled' },
        { id: 106, restaurant: 'Subway', deliveryAddress: '888 River Dr', date: '2026-01-30', time: '16:20', earnings: 4.50, tip: 2.00, distance: '1.2 km', rating: 5, status: 'completed' },
    ]);

    const filteredDeliveries = deliveries.filter(delivery => {
        const matchesSearch = delivery.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
            delivery.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || delivery.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalEarnings = deliveries
        .filter(d => d.status === 'completed')
        .reduce((sum, d) => sum + d.earnings + d.tip, 0);

    const totalDeliveries = deliveries.filter(d => d.status === 'completed').length;

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-2 rounded-full bg-[#1E1E1E]"
                    >
                        <Text className="text-white">←</Text>
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white text-2xl font-bold">Delivery History</Text>
                        <Text className="text-[#A0A0A0] text-sm">{totalDeliveries} completed deliveries</Text>
                    </View>
                </View>
            </View>

            {/* Stats Summary */}
            <View className="px-4 py-4 bg-[#1E1E1E] border-b border-[#333]">
                <View className="flex-row space-x-4">
                    <View className="flex-1 bg-[#121212] p-3 rounded-lg">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Total Earnings</Text>
                        <Text className="text-[#1DB954] text-2xl font-bold mt-1">${totalEarnings.toFixed(2)}</Text>
                    </View>
                    <View className="flex-1 bg-[#121212] p-3 rounded-lg">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Avg per Delivery</Text>
                        <Text className="text-white text-2xl font-bold mt-1">
                            ${totalDeliveries > 0 ? (totalEarnings / totalDeliveries).toFixed(2) : '0.00'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-4">
                <SearchBarComponent
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search deliveries..."
                    recentSearches={searchHistory}
                    onRecentSearchPress={(search) => setSearchQuery(search)}
                    onClearHistory={handleClearHistory}
                />
            </View>

            {/* Filter Tabs */}
            <View className="px-4 mb-4">
                <View className="flex-row space-x-2">
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${filterStatus === 'all' ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                        onPress={() => setFilterStatus('all')}
                    >
                        <Text className={filterStatus === 'all' ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                            All ({deliveries.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${filterStatus === 'completed' ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                        onPress={() => setFilterStatus('completed')}
                    >
                        <Text className={filterStatus === 'completed' ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                            Completed ({deliveries.filter(d => d.status === 'completed').length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${filterStatus === 'cancelled' ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                        onPress={() => setFilterStatus('cancelled')}
                    >
                        <Text className={filterStatus === 'cancelled' ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                            Cancelled ({deliveries.filter(d => d.status === 'cancelled').length})
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Delivery List */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {filteredDeliveries.map(delivery => (
                    <View key={delivery.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-base mb-1">{delivery.restaurant}</Text>
                                <Text className="text-[#666] text-xs">📍 {delivery.deliveryAddress}</Text>
                            </View>
                            <View className={`px-2 py-1 rounded-full ${delivery.status === 'completed' ? 'bg-[#1DB95420] border border-[#1DB954]' : 'bg-[#FF6B6B20] border border-[#FF6B6B]'}`}>
                                <Text className={`text-xs font-bold ${delivery.status === 'completed' ? 'text-[#1DB954]' : 'text-[#FF6B6B]'}`}>
                                    {delivery.status.toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center pt-3 border-t border-[#333]">
                            <View>
                                <Text className="text-[#666] text-xs">Date & Time</Text>
                                <Text className="text-white text-sm">{delivery.date} • {delivery.time}</Text>
                            </View>
                            <View>
                                <Text className="text-[#666] text-xs">Distance</Text>
                                <Text className="text-white text-sm">🚗 {delivery.distance}</Text>
                            </View>
                            {delivery.status === 'completed' && (
                                <>
                                    <View>
                                        <Text className="text-[#666] text-xs">Rating</Text>
                                        <Text className="text-white text-sm">⭐ {delivery.rating}.0</Text>
                                    </View>
                                    <View>
                                        <Text className="text-[#666] text-xs">Earnings</Text>
                                        <Text className="text-[#1DB954] font-bold text-sm">
                                            +${(delivery.earnings + delivery.tip).toFixed(2)}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>

                        {delivery.status === 'completed' && delivery.tip > 0 && (
                            <View className="mt-2 pt-2 border-t border-[#333]">
                                <Text className="text-[#A0A0A0] text-xs">
                                    Base: ${delivery.earnings.toFixed(2)} • Tip: ${delivery.tip.toFixed(2)}
                                </Text>
                            </View>
                        )}
                    </View>
                ))}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
