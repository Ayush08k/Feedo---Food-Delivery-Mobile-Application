import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from '../cart/CartContext';
import { useAlert } from '../utils/AlertContext';

// Mock orders data
const MOCK_ORDERS = [
    {
        id: '1',
        orderNumber: '#ORD-2024-001',
        restaurantName: 'Gourmet Burger Kitchen',
        restaurantId: 1,
        restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
        items: ['Classic Burger', 'French Fries', 'Coke'],
        detailedItems: [
            { id: 101, name: 'Classic Burger', price: 12.99 },
            { id: 102, name: 'French Fries', price: 4.99 },
            { id: 103, name: 'Coke', price: 2.99 }
        ],
        itemCount: 3,
        totalAmount: 24.99,
        status: 'delivered',
        orderDate: 'Feb 10, 2026',
        orderTime: '2:30 PM',
        deliveryTime: '30 mins',
        rating: 4.5
    },
    {
        id: '2',
        orderNumber: '#ORD-2024-002',
        restaurantName: 'Pizza Palace',
        restaurantId: 3,
        restaurantImage: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80',
        items: ['Margherita Pizza', 'Garlic Bread'],
        detailedItems: [
            { id: 201, name: 'Margherita Pizza', price: 12.99 },
            { id: 202, name: 'Garlic Bread', price: 5.51 }
        ],
        itemCount: 2,
        totalAmount: 18.50,
        status: 'in-transit',
        orderDate: 'Feb 12, 2026',
        orderTime: '7:15 PM',
        deliveryTime: '15 mins',
        rating: null
    },
    {
        id: '3',
        orderNumber: '#ORD-2024-003',
        restaurantName: 'Sushi Master',
        restaurantId: 2,
        restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80',
        items: ['California Roll', 'Tuna Sashimi', 'Miso Soup'],
        detailedItems: [
            { id: 301, name: 'California Roll', price: 15.99 },
            { id: 302, name: 'Tuna Sashimi', price: 12.00 },
            { id: 303, name: 'Miso Soup', price: 4.01 }
        ],
        itemCount: 3,
        totalAmount: 32.00,
        status: 'delivered',
        orderDate: 'Feb 08, 2026',
        orderTime: '1:45 PM',
        deliveryTime: '45 mins',
        rating: 5.0
    },
    {
        id: '4',
        orderNumber: '#ORD-2024-004',
        restaurantName: 'The Breakfast Club',
        restaurantId: 4,
        restaurantImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80',
        items: ['Pancakes', 'Scrambled Eggs', 'Coffee'],
        detailedItems: [
            { id: 401, name: 'Pancakes', price: 8.99 },
            { id: 402, name: 'Scrambled Eggs', price: 5.49 },
            { id: 403, name: 'Coffee', price: 2.27 }
        ],
        itemCount: 3,
        totalAmount: 16.75,
        status: 'cancelled',
        orderDate: 'Feb 05, 2026',
        orderTime: '9:00 AM',
        deliveryTime: 'N/A',
        rating: null
    }
];

export default function YourOrdersScreen() {
    const navigation = useNavigation<any>();
    const { addMultipleToCart } = useCart();
    const { showAlert } = useAlert();
    const [filter, setFilter] = useState<'all' | 'delivered' | 'in-transit' | 'cancelled'>('all');

    const filteredOrders = filter === 'all'
        ? MOCK_ORDERS
        : MOCK_ORDERS.filter(order => order.status === filter);

    const handleReorder = (order: any) => {
        if (order.detailedItems && order.detailedItems.length > 0) {
            addMultipleToCart(order.detailedItems, order.restaurantId);
            showAlert(
                'Added to Cart! 🛒',
                `${order.itemCount} item(s) from ${order.restaurantName} have been added to your cart.`,
                [
                    { text: 'Continue Shopping', style: 'cancel' },
                    { text: 'View Cart', onPress: () => navigation.navigate('Cart') }
                ]
            );
        }
    };

    const handleRateOrder = (order: any) => {
        navigation.navigate('RateOrder', { order });
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'delivered':
                return {
                    color: '#1DB954',
                    bg: '#1DB954',
                    icon: '✓',
                    label: 'Delivered',
                    gradient: ['#1DB954', '#15a045'] as const
                };
            case 'in-transit':
                return {
                    color: '#FFD93D',
                    bg: '#FFD93D',
                    icon: '🚴',
                    label: 'On the Way',
                    gradient: ['#FFD93D', '#FFC107'] as const
                };
            case 'cancelled':
                return {
                    color: '#FF6B6B',
                    bg: '#FF6B6B',
                    icon: '✕',
                    label: 'Cancelled',
                    gradient: ['#FF6B6B', '#e55555'] as const
                };
            default:
                return {
                    color: '#666',
                    bg: '#666',
                    icon: '•',
                    label: status,
                    gradient: ['#666', '#555'] as const
                };
        }
    };

    const getFilterCount = (filterType: string) => {
        if (filterType === 'all') return MOCK_ORDERS.length;
        return MOCK_ORDERS.filter(order => order.status === filterType).length;
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#1a1a1a]">
                <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 w-10 h-10 bg-[#1E1E1E] rounded-full items-center justify-center border border-[#333]">
                            <Text className="text-[#1DB954] text-xl">←</Text>
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white text-2xl font-bold">Your Orders</Text>
                            <Text className="text-[#666] text-sm">{MOCK_ORDERS.length} total orders</Text>
                        </View>
                    </View>
                </View>

                {/* Filter Pills */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {[
                        { key: 'all', label: 'All', emoji: '📦' },
                        { key: 'delivered', label: 'Delivered', emoji: '✅' },
                        { key: 'in-transit', label: 'Active', emoji: '🚴' },
                        { key: 'cancelled', label: 'Cancelled', emoji: '❌' }
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            className={`mr-3 px-5 py-3 rounded-full border-2 ${filter === tab.key
                                ? 'bg-[#1DB954] border-[#1DB954]'
                                : 'bg-[#1E1E1E] border-[#333]'
                                }`}
                            onPress={() => setFilter(tab.key as any)}
                        >
                            <View className="flex-row items-center">
                                <Text className="mr-2">{tab.emoji}</Text>
                                <Text className={`font-bold ${filter === tab.key ? 'text-black' : 'text-white'}`}>
                                    {tab.label}
                                </Text>
                                <View className={`ml-2 w-6 h-6 rounded-full items-center justify-center ${filter === tab.key ? 'bg-black/20' : 'bg-[#1DB954]/20'
                                    }`}>
                                    <Text className={`text-xs font-bold ${filter === tab.key ? 'text-black' : 'text-[#1DB954]'}`}>
                                        {getFilterCount(tab.key)}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Orders List */}
            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {filteredOrders.length === 0 ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <View className="w-32 h-32 bg-[#1E1E1E] rounded-full items-center justify-center mb-6 border-4 border-[#333]">
                            <Text className="text-6xl">📦</Text>
                        </View>
                        <Text className="text-white text-2xl font-bold mb-3">No orders found</Text>
                        <Text className="text-[#A0A0A0] text-center text-base px-8">
                            {filter === 'all' ? 'Start ordering delicious food!' : `No ${filter.replace('-', ' ')} orders`}
                        </Text>
                    </View>
                ) : (
                    filteredOrders.map((order, index) => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                            <TouchableOpacity
                                key={order.id}
                                className="mb-4 bg-[#1a1a1a] rounded-3xl overflow-hidden border-2 border-[#2a2a2a]"
                                style={{
                                    shadowColor: statusConfig.color,
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 8,
                                }}
                            >
                                {/* Status Bar */}
                                <LinearGradient
                                    colors={statusConfig.gradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    className="px-4 py-3"
                                >
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <View className="w-6 h-6 bg-white/30 rounded-full items-center justify-center mr-2">
                                                <Text className="text-white font-bold text-xs">{statusConfig.icon}</Text>
                                            </View>
                                            <Text className="text-white font-bold text-sm">{statusConfig.label}</Text>
                                        </View>
                                        <Text className="text-white/80 text-xs font-semibold">{order.orderNumber}</Text>
                                    </View>
                                </LinearGradient>

                                {/* Order Content */}
                                <View className="p-4">
                                    {/* Restaurant Info */}
                                    <View className="flex-row mb-4">
                                        <Image
                                            source={{ uri: order.restaurantImage }}
                                            className="w-24 h-24 rounded-2xl mr-4"
                                        />
                                        <View className="flex-1 justify-between">
                                            <View>
                                                <Text className="text-white font-bold text-lg mb-1">
                                                    {order.restaurantName}
                                                </Text>
                                                <Text className="text-[#888] text-sm mb-2" numberOfLines={2}>
                                                    {order.items.slice(0, 2).join(' • ')}
                                                    {order.items.length > 2 && ` + ${order.items.length - 2} more`}
                                                </Text>
                                            </View>
                                            <View className="flex-row items-center">
                                                <View className="bg-[#1DB954]/20 px-3 py-1 rounded-full mr-2">
                                                    <Text className="text-[#1DB954] text-xs font-bold">
                                                        {order.itemCount} items
                                                    </Text>
                                                </View>
                                                {order.rating && (
                                                    <View className="bg-[#FFD93D]/20 px-3 py-1 rounded-full flex-row items-center">
                                                        <Text className="text-[#FFD93D] text-xs font-bold mr-1">★</Text>
                                                        <Text className="text-[#FFD93D] text-xs font-bold">{order.rating}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    {/* Divider */}
                                    <View className="h-[1px] bg-[#333] mb-4" />

                                    {/* Order Details */}
                                    <View className="flex-row items-center justify-between mb-4">
                                        <View className="flex-row items-center">
                                            <View className="bg-[#1E1E1E] w-10 h-10 rounded-full items-center justify-center mr-3">
                                                <Text className="text-lg">📅</Text>
                                            </View>
                                            <View>
                                                <Text className="text-[#666] text-xs">Order Date</Text>
                                                <Text className="text-white font-semibold text-sm">
                                                    {order.orderDate} • {order.orderTime}
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="items-end">
                                            <Text className="text-[#666] text-xs">Total Amount</Text>
                                            <Text className="text-[#1DB954] font-bold text-xl">
                                                ${order.totalAmount.toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Action Buttons */}
                                    <View className="flex-row gap-3">
                                        {order.status === 'delivered' && (
                                            <>
                                                <TouchableOpacity
                                                    className="flex-1 bg-[#1DB954] py-3 rounded-xl"
                                                    onPress={() => handleReorder(order)}
                                                >
                                                    <Text className="text-black text-center font-bold">Reorder</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    className="flex-1 bg-[#1E1E1E] py-3 rounded-xl border border-[#333]"
                                                    onPress={() => handleRateOrder(order)}
                                                >
                                                    <Text className="text-white text-center font-bold">Rate Order</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                        {order.status === 'in-transit' && (
                                            <>
                                                <TouchableOpacity className="flex-1 bg-[#FFD93D] py-3 rounded-xl">
                                                    <Text className="text-black text-center font-bold">Track Order</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity className="flex-1 bg-[#1E1E1E] py-3 rounded-xl border border-[#333]">
                                                    <Text className="text-white text-center font-bold">Contact Support</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                        {order.status === 'cancelled' && (
                                            <TouchableOpacity className="flex-1 bg-[#1E1E1E] py-3 rounded-xl border border-[#333]">
                                                <Text className="text-white text-center font-bold">View Details</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
                <View className="h-24" />
            </ScrollView>
        </SafeAreaView>
    );
}
