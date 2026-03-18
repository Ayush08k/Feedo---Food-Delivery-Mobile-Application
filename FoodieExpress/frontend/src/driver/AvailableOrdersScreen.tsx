import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBarComponent from '../utils/SearchBarComponent';
import { useDriverStatus } from './DriverStatusContext';

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
    const [showConfirm, setShowConfirm] = useState(false);
    const { isOnline, setIsOnline } = useDriverStatus();

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

    const handleGoOnline = () => {
        setIsOnline(true);
        setShowConfirm(false);
    };

    // ── Offline Guard ──────────────────────────────────────────────────────────
    if (!isOnline) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
                {/* Header */}
                <View style={{
                    paddingHorizontal: 16, paddingVertical: 16,
                    borderBottomWidth: 1, borderBottomColor: '#333',
                }}>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Available Orders</Text>
                </View>

                {/* Offline message */}
                <View style={{
                    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28,
                }}>
                    <View style={{
                        width: 110, height: 110, borderRadius: 55,
                        backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 24, borderWidth: 2, borderColor: '#FF4D4D44',
                    }}>
                        <Text style={{ fontSize: 52 }}>😴</Text>
                    </View>

                    <Text style={{
                        color: '#fff', fontSize: 22, fontWeight: 'bold',
                        marginBottom: 10, textAlign: 'center',
                    }}>
                        You're Offline
                    </Text>
                    <Text style={{
                        color: '#A0A0A0', fontSize: 15, textAlign: 'center',
                        lineHeight: 22, marginBottom: 32,
                    }}>
                        You need to go online first to see and accept available delivery orders.
                    </Text>

                    {/* Activate button */}
                    <TouchableOpacity
                        onPress={() => setShowConfirm(true)}
                        style={{
                            backgroundColor: '#1DB954',
                            paddingHorizontal: 36, paddingVertical: 16,
                            borderRadius: 14, flexDirection: 'row',
                            alignItems: 'center',
                            shadowColor: '#1DB954', shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
                        }}
                    >
                        <Ionicons name="power" size={20} color="#000" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 17 }}>
                            Go Online
                        </Text>
                    </TouchableOpacity>

                    <Text style={{ color: '#555', fontSize: 12, marginTop: 16 }}>
                        You can also toggle online from the Dashboard
                    </Text>
                </View>

                {/* Confirmation Modal */}
                <Modal
                    visible={showConfirm}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowConfirm(false)}
                >
                    <View style={{
                        flex: 1, backgroundColor: '#000000AA',
                        alignItems: 'center', justifyContent: 'center', padding: 24,
                    }}>
                        <View style={{
                            backgroundColor: '#1E1E1E', borderRadius: 20,
                            padding: 28, width: '100%',
                            borderWidth: 1, borderColor: '#333',
                        }}>
                            {/* Icon */}
                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                <View style={{
                                    width: 72, height: 72, borderRadius: 36,
                                    backgroundColor: '#1DB95420', alignItems: 'center', justifyContent: 'center',
                                    borderWidth: 2, borderColor: '#1DB95455', marginBottom: 12,
                                }}>
                                    <Ionicons name="power" size={36} color="#1DB954" />
                                </View>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                                    Go Online?
                                </Text>
                            </View>

                            <Text style={{
                                color: '#A0A0A0', fontSize: 15, textAlign: 'center',
                                lineHeight: 22, marginBottom: 28,
                            }}>
                                Are you sure you want to come online? You'll start receiving delivery requests immediately.
                            </Text>

                            {/* Buttons */}
                            <TouchableOpacity
                                onPress={handleGoOnline}
                                style={{
                                    backgroundColor: '#1DB954',
                                    paddingVertical: 14, borderRadius: 12,
                                    alignItems: 'center', marginBottom: 12,
                                }}
                            >
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                                    ✓ Yes, Go Online
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowConfirm(false)}
                                style={{
                                    backgroundColor: '#2A2A2A',
                                    paddingVertical: 14, borderRadius: 12,
                                    alignItems: 'center', borderWidth: 1, borderColor: '#444',
                                }}
                            >
                                <Text style={{ color: '#A0A0A0', fontWeight: 'bold', fontSize: 16 }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

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
