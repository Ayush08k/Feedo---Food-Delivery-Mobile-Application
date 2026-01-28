import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
// import { io } from 'socket.io-client'; // Socket integration later

const STATUS_STEPS = [
    { status: 'CONFIRMED', label: 'Order Confirmed', time: '12:05 PM' },
    { status: 'PREPARING', label: 'Preparing Food', time: '12:10 PM' },
    { status: 'PICKED_UP', label: 'Driver on the way', time: '12:25 PM' },
    { status: 'DELIVERED', label: 'Delivered', time: '12:40 PM' },
];

export default function OrderTrackingScreen() {
    const navigation = useNavigation<any>();
    const [currentStatus, setCurrentStatus] = useState('PREPARING');

    useEffect(() => {
        // Mock upgrades
        const timer = setTimeout(() => {
            setCurrentStatus('PICKED_UP');
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Map Placeholder */}
            <View className="h-1/2 bg-[#1E1E1E] items-center justify-center border-b border-[#333]">
                <Text className="text-[#1DB954] text-6xl">🗺️</Text>
                <Text className="text-[#A0A0A0] mt-4">Live Map Simulation</Text>
                {currentStatus === 'PICKED_UP' && (
                    <Text className="text-white mt-2 font-bold bg-[#1DB954]/20 px-4 py-1 rounded-full text-[#1DB954]">Driver is approaching (2 mins away)</Text>
                )}
            </View>

            <ScrollView className="flex-1 px-6 pt-6 bg-[#121212]">
                <Text className="text-white text-2xl font-bold mb-6">Track Order #1234</Text>

                <View className="ml-2 border-l-2 border-[#333] pl-6 pb-10">
                    {STATUS_STEPS.map((step, index) => {
                        const isActive = step.status === currentStatus;
                        const isPast = STATUS_STEPS.findIndex(s => s.status === currentStatus) >= index;

                        return (
                            <View key={step.status} className="mb-8 relative">
                                {/* Dot */}
                                <View className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 ${isPast ? 'bg-[#1DB954] border-[#1DB954]' : 'bg-[#121212] border-[#666]'}`} />

                                <View className={isPast ? 'opacity-100' : 'opacity-30'}>
                                    <Text className="text-white font-bold text-lg">{step.label}</Text>
                                    <Text className="text-[#A0A0A0]">{step.time}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                <TouchableOpacity
                    className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] flex-row items-center mb-10"
                    onPress={() => navigation.navigate('Home')}
                >
                    <View className="w-10 h-10 bg-[#333] rounded-full mr-4" />
                    <View>
                        <Text className="text-white font-bold">John Driver</Text>
                        <Text className="text-[#A0A0A0]">Toyota Prius • 4.9 ★</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
