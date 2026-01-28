import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RestaurantDashboard() {
    const [isOpen, setIsOpen] = useState(true);

    const orders = [
        { id: 101, items: ['Whopper Meal x2', 'Coke Zero x1'], status: 'PENDING', total: 25.50 },
        { id: 102, items: ['Chicken Royale', 'Fries'], status: 'PREPARING', total: 12.00 }
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="p-6 border-b border-[#333] flex-row justify-between items-center">
                <View>
                    <Text className="text-white text-2xl font-bold">Restaurant Admin</Text>
                    <Text className={isOpen ? "text-[#1DB954]" : "text-[#A0A0A0]"}>
                        {isOpen ? '● Open for Orders' : '○ Closed'}
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: "#333", true: "#1DB954" }}
                    thumbColor={isOpen ? "#fff" : "#f4f3f4"}
                    onValueChange={() => setIsOpen(!isOpen)}
                    value={isOpen}
                />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="flex-row mb-6 space-x-4">
                    <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Today's Sales</Text>
                        <Text className="text-white text-2xl font-bold">$125.50</Text>
                    </View>
                    <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Active Orders</Text>
                        <Text className="text-[#1DB954] text-2xl font-bold">2</Text>
                    </View>
                </View>

                <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4">Incoming Orders</Text>
                {orders.map(order => (
                    <View key={order.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-white font-bold text-lg">Order #{order.id}</Text>
                            <Text className="text-[#1DB954] font-bold text-lg">${order.total.toFixed(2)}</Text>
                        </View>
                        <View className="mb-4">
                            {order.items.map((item, idx) => (
                                <Text key={idx} className="text-[#A0A0A0]">• {item}</Text>
                            ))}
                        </View>

                        {order.status === 'PENDING' ? (
                            <View className="flex-row space-x-2">
                                <TouchableOpacity className="flex-1 bg-red-900/50 py-3 rounded-lg items-center border border-red-900">
                                    <Text className="text-red-500 font-bold">Reject</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-[#1DB954] py-3 rounded-lg items-center">
                                    <Text className="text-black font-bold">Accept</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity className="bg-[#1E1E1E] border border-[#1DB954] py-3 rounded-lg items-center">
                                <Text className="text-[#1DB954] font-bold">Mark Ready for Pickup</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
