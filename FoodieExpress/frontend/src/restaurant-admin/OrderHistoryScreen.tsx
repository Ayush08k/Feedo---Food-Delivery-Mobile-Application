import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface Order {
    id: string;
    customerName: string;
    items: { name: string; quantity: number; price: number }[];
    totalAmount: number;
    status: 'pending' | 'preparing' | 'ready' | 'picked-up' | 'delivered' | 'cancelled';
    orderTime: string;
    deliveryAddress: string;
    paymentMethod: string;
}

export default function OrderHistoryScreen() {
    const navigation = useNavigation<any>();
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'>('all');

    const orders: Order[] = [
        {
            id: '#ORD-1234',
            customerName: 'John Doe',
            items: [
                { name: 'Margherita Pizza', quantity: 2, price: 12.99 },
                { name: 'Garlic Bread', quantity: 1, price: 4.99 },
            ],
            totalAmount: 30.97,
            status: 'preparing',
            orderTime: '2026-01-31 19:30',
            deliveryAddress: '123 Main St, Apt 4B',
            paymentMethod: 'Card'
        },
        {
            id: '#ORD-1233',
            customerName: 'Jane Smith',
            items: [
                { name: 'Chicken Burger', quantity: 1, price: 8.99 },
                { name: 'French Fries', quantity: 1, price: 3.99 },
                { name: 'Coke', quantity: 1, price: 1.99 },
            ],
            totalAmount: 14.97,
            status: 'ready',
            orderTime: '2026-01-31 19:25',
            deliveryAddress: '456 Oak Ave',
            paymentMethod: 'Cash'
        },
        {
            id: '#ORD-1232',
            customerName: 'Mike Johnson',
            items: [
                { name: 'Veggie Pizza', quantity: 1, price: 11.99 },
            ],
            totalAmount: 11.99,
            status: 'delivered',
            orderTime: '2026-01-31 19:15',
            deliveryAddress: '789 Pine Rd',
            paymentMethod: 'Card'
        },
        {
            id: '#ORD-1231',
            customerName: 'Sarah Williams',
            items: [
                { name: 'Pasta Carbonara', quantity: 2, price: 13.99 },
            ],
            totalAmount: 27.98,
            status: 'pending',
            orderTime: '2026-01-31 19:40',
            deliveryAddress: '321 Elm St',
            paymentMethod: 'Card'
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFD93D';
            case 'preparing': return '#FF9800';
            case 'ready': return '#1DB954';
            case 'picked-up': return '#00BCD4';
            case 'delivered': return '#666';
            case 'cancelled': return '#FF6B6B';
            default: return '#666';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return '⏱️';
            case 'preparing': return '👨‍🍳';
            case 'ready': return '✅';
            case 'picked-up': return '🚗';
            case 'delivered': return '📦';
            case 'cancelled': return '❌';
            default: return '📋';
        }
    };

    const filteredOrders = orders.filter(order => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'completed') return order.status === 'delivered';
        return order.status === selectedFilter;
    });

    const filters = [
        { key: 'all' as const, label: 'All', count: orders.length },
        { key: 'pending' as const, label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
        { key: 'preparing' as const, label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length },
        { key: 'ready' as const, label: 'Ready', count: orders.filter(o => o.status === 'ready').length },
        { key: 'completed' as const, label: 'Completed', count: orders.filter(o => o.status === 'delivered').length },
        { key: 'cancelled' as const, label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length },
    ];

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
                            <Text className="text-white text-2xl font-bold">Order History</Text>
                            <Text className="text-[#A0A0A0] text-sm">{filteredOrders.length} orders</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="bg-[#1E1E1E] border-b border-[#333]"
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
            >
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter.key}
                        className={`px-4 py-2 rounded-full mr-3 flex-row items-center ${selectedFilter === filter.key ? 'bg-[#1DB954]' : 'bg-[#121212] border border-[#333]'
                            }`}
                        onPress={() => setSelectedFilter(filter.key)}
                    >
                        <Text className={selectedFilter === filter.key ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                            {filter.label}
                        </Text>
                        <View
                            className={`ml-2 px-2 py-0.5 rounded-full ${selectedFilter === filter.key ? 'bg-black/20' : 'bg-[#1E1E1E]'
                                }`}
                        >
                            <Text
                                className={`text-xs font-bold ${selectedFilter === filter.key ? 'text-black' : 'text-[#666]'
                                    }`}
                            >
                                {filter.count}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <View className="py-4">
                    {filteredOrders.map((order) => (
                        <TouchableOpacity
                            key={order.id}
                            className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4"
                            onPress={() => navigation.navigate('OrderDetails', { order })}
                        >
                            {/* Header */}
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-lg mb-1">{order.id}</Text>
                                    <Text className="text-[#A0A0A0] text-sm">{order.customerName}</Text>
                                    <Text className="text-[#666] text-xs mt-1">{order.orderTime}</Text>
                                </View>
                                <View
                                    className="px-3 py-1 rounded-full flex-row items-center"
                                    style={{
                                        backgroundColor: getStatusColor(order.status) + '20',
                                        borderColor: getStatusColor(order.status),
                                        borderWidth: 1
                                    }}
                                >
                                    <Text className="mr-1">{getStatusIcon(order.status)}</Text>
                                    <Text
                                        className="text-xs font-bold capitalize"
                                        style={{ color: getStatusColor(order.status) }}
                                    >
                                        {order.status}
                                    </Text>
                                </View>
                            </View>

                            {/* Items */}
                            <View className="border-t border-[#333] pt-3 mb-3">
                                {order.items.map((item, index) => (
                                    <View key={index} className="flex-row justify-between mb-1">
                                        <Text className="text-[#A0A0A0] text-sm">
                                            {item.quantity}x {item.name}
                                        </Text>
                                        <Text className="text-white text-sm">${item.price.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>

                            {/* Footer */}
                            <View className="flex-row justify-between items-center pt-3 border-t border-[#333]">
                                <View>
                                    <Text className="text-[#666] text-xs">Total Amount</Text>
                                    <Text className="text-[#1DB954] font-bold text-lg">${order.totalAmount.toFixed(2)}</Text>
                                </View>
                                <View className="flex-row space-x-2">
                                    <Text className="text-[#666] text-xs">📍 {order.deliveryAddress.split(',')[0]}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
