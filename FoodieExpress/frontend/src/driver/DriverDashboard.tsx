import React, { useState } from 'react';
import { View, Text, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function DriverDashboard() {
    const navigation = useNavigation<any>();
    const [isOnline, setIsOnline] = useState(false);

    const activeOrders = [
        { id: 101, restaurant: 'Burger King', address: '456 Wall St', fee: 5.50, status: 'READY' }
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="p-6 border-b border-[#333] flex-row justify-between items-center">
                <View>
                    <Text className="text-white text-2xl font-bold">Driver Dashboard</Text>
                    <Text className={isOnline ? "text-[#1DB954]" : "text-[#A0A0A0]"}>
                        {isOnline ? '● Online' : '○ Offline'}
                    </Text>
                </View>
                <Switch
                    trackColor={{ false: "#333", true: "#1DB954" }}
                    thumbColor={isOnline ? "#fff" : "#f4f3f4"}
                    onValueChange={() => setIsOnline(!isOnline)}
                    value={isOnline}
                />
            </View>

            <ScrollView className="flex-1 p-4">
                {!isOnline ? (
                    <View className="items-center justify-center flex-1 mt-20">
                        <Text className="text-6xl mb-4">😴</Text>
                        <Text className="text-[#A0A0A0] text-lg">Go online to receive orders</Text>
                    </View>
                ) : (
                    <View>
                        <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4">Available Orders</Text>
                        {activeOrders.map(order => (
                            <View key={order.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-white font-bold text-lg">{order.restaurant}</Text>
                                    <Text className="text-[#1DB954] font-bold text-lg">${order.fee.toFixed(2)}</Text>
                                </View>
                                <Text className="text-[#A0A0A0] mb-4">📍 {order.address}</Text>
                                <TouchableOpacity
                                    className="bg-[#1DB954] py-3 rounded-lg items-center"
                                    onPress={() => navigation.navigate('DriverDelivery')}
                                >
                                    <Text className="text-black font-bold">Accept Delivery</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
