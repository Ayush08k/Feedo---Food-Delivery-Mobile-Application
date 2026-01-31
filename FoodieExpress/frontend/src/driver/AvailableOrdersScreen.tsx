import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBarComponent from '../utils/SearchBarComponent';

interface Order {
    id: number;
    restaurant: string;
    restaurantAddress: string;
    deliveryAddress: string;
    distance: string;
    fee: number;
    estimatedTime: string;
    items: string[];
    total: number;
}

export default function AvailableOrdersScreen() {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'distance' | 'fee' | 'time'>('distance');

    const [orders, setOrders] = useState<Order[]>([
        {
            id: 201,
            restaurant: 'Burger King',
            restaurantAddress: '123 Main St',
            deliveryAddress: '456 Wall St, Apt 5B',
            distance: '2.3 km',
            fee: 5.50,
            estimatedTime: '15-20 min',
            items: ['Whopper Meal', 'Chicken Fries'],
            total: 18.99
        },
        {
            id: 202,
            restaurant: 'Pizza Hut',
            restaurantAddress: '789 Oak Ave',
            deliveryAddress: '321 Pine Rd',
            distance: '1.8 km',
            fee: 4.75,
            estimatedTime: '10-15 min',
            items: ['Large Pepperoni Pizza', 'Garlic Bread'],
            total: 24.50
        },
        {
            id: 203,
            restaurant: 'Sushi Master',
            restaurantAddress: '555 Beach Blvd',
            deliveryAddress: '888 River Dr',
            distance: '3.5 km',
            fee: 6.25,
            estimatedTime: '20-25 min',
            items: ['California Roll x2', 'Miso Soup'],
            total: 32.00
        },
        {
            id: 204,
            restaurant: 'Taco Bell',
            restaurantAddress: '222 Grove St',
            deliveryAddress: '999 Lake Ave',
            distance: '1.2 km',
            fee: 4.00,
            estimatedTime: '8-12 min',
            items: ['Taco Supreme x3', 'Nachos'],
            total: 15.75
        },
    ]);

    const filteredOrders = orders.filter(order =>
        order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortBy === 'distance') {
            return parseFloat(a.distance) - parseFloat(b.distance);
        } else if (sortBy === 'fee') {
            return b.fee - a.fee;
        }
        return 0;
    });

    const acceptOrder = (orderId: number) => {
        navigation.navigate('DriverDelivery', { orderId });
    };

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
                        <Text className="text-white text-2xl font-bold">Available Orders</Text>
                        <Text className="text-[#A0A0A0] text-sm">{sortedOrders.length} orders nearby</Text>
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-4">
                <SearchBarComponent
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search by restaurant or location..."
                />
            </View>

            {/* Sort Options */}
            <View className="px-4 mb-4">
                <Text className="text-[#A0A0A0] text-xs uppercase font-bold mb-2">Sort By</Text>
                <View className="flex-row space-x-2">
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${sortBy === 'distance' ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                        onPress={() => setSortBy('distance')}
                    >
                        <Text className={sortBy === 'distance' ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                            Distance
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${sortBy === 'fee' ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                        onPress={() => setSortBy('fee')}
                    >
                        <Text className={sortBy === 'fee' ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                            Highest Fee
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`px-4 py-2 rounded-full ${sortBy === 'time' ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                        onPress={() => setSortBy('time')}
                    >
                        <Text className={sortBy === 'time' ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                            Quickest
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Orders List */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {sortedOrders.map(order => (
                    <View key={order.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                        {/* Restaurant & Fee */}
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg mb-1">{order.restaurant}</Text>
                                <Text className="text-[#666] text-xs">📍 {order.restaurantAddress}</Text>
                            </View>
                            <View className="bg-[#1DB95420] border border-[#1DB954] px-3 py-2 rounded-lg">
                                <Text className="text-[#1DB954] font-bold text-lg">${order.fee.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* Order Items */}
                        <View className="bg-[#121212] p-3 rounded-lg mb-3">
                            <Text className="text-[#A0A0A0] text-xs uppercase font-bold mb-2">Order Items</Text>
                            {order.items.map((item, idx) => (
                                <Text key={idx} className="text-white text-sm mb-1">• {item}</Text>
                            ))}
                            <Text className="text-[#1DB954] font-bold text-sm mt-2">
                                Total: ${order.total.toFixed(2)}
                            </Text>
                        </View>

                        {/* Delivery Details */}
                        <View className="mb-3">
                            <Text className="text-[#A0A0A0] text-xs uppercase font-bold mb-2">Delivery To</Text>
                            <Text className="text-white">📍 {order.deliveryAddress}</Text>
                        </View>

                        {/* Stats & Action */}
                        <View className="flex-row justify-between items-center pt-3 border-t border-[#333]">
                            <View className="flex-row space-x-4">
                                <View>
                                    <Text className="text-[#666] text-xs">Distance</Text>
                                    <Text className="text-white font-bold">🚗 {order.distance}</Text>
                                </View>
                                <View>
                                    <Text className="text-[#666] text-xs">Est. Time</Text>
                                    <Text className="text-white font-bold">⏱️ {order.estimatedTime}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                className="bg-[#1DB954] px-6 py-3 rounded-lg"
                                onPress={() => acceptOrder(order.id)}
                            >
                                <Text className="text-black font-bold">Accept</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
