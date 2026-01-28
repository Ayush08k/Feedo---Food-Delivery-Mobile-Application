import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function DeliveryScreen() {
    const navigation = useNavigation<any>();
    const [step, setStep] = useState(0); // 0: To Restaurant, 1: To Customer

    const handleAction = () => {
        if (step === 0) {
            Alert.alert('Order Picked Up', 'Proceed to customer location.');
            setStep(1);
        } else {
            Alert.alert('Delivered!', 'Good job. Earnings updated.');
            navigation.goBack();
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="p-4 border-b border-[#333]">
                <Text className="text-white text-xl font-bold">Current Delivery</Text>
            </View>

            {/* Map Placeholder */}
            <View className="h-1/3 bg-[#1E1E1E] items-center justify-center border-b border-[#333]">
                <Text className="text-6xl">🗺️</Text>
                <Text className="text-[#A0A0A0] mt-2">Navigation View</Text>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-2">
                        {step === 0 ? 'Pick Up At' : 'Deliver To'}
                    </Text>
                    <Text className="text-white text-2xl font-bold mb-1">
                        {step === 0 ? 'Burger King' : 'John Customer'}
                    </Text>
                    <Text className="text-[#A0A0A0] text-lg">
                        {step === 0 ? '456 Wall St' : '789 Residential Ave, Apt 4B'}
                    </Text>
                </View>

                <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-6">
                    <Text className="text-white font-bold mb-2">Order #1234 Details</Text>
                    <View className="flex-row justify-between">
                        <Text className="text-[#A0A0A0]">2x Whopper Meal</Text>
                        <Text className="text-[#A0A0A0]">1x Coke Zero</Text>
                    </View>
                </View>

                <TouchableOpacity
                    className={`p-4 rounded-xl items-center ${step === 0 ? 'bg-[#1DB954]' : 'bg-[#1DB954]'}`}
                    onPress={handleAction}
                >
                    <Text className="text-black font-bold text-lg">
                        {step === 0 ? 'Confirm Pickup' : 'Complete Delivery'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
