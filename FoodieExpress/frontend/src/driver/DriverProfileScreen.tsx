import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { loadProfileData } from '../utils/profileUtils';

export default function DriverProfileScreen() {
    const navigation = useNavigation<any>();
    const [profileData, setProfileData] = useState<any>(null);

    useEffect(() => {
        const loadProfile = async () => {
            const data = await loadProfileData();
            if (data) {
                setProfileData(data);
            }
        };
        loadProfile();

        const unsubscribe = navigation.addListener('focus', () => {
            loadProfile();
        });

        return unsubscribe;
    }, [navigation]);

    const handleLogout = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            })
        );
    };

    const menuItems = [
        { label: 'Edit Profile', icon: '👤', onPress: () => navigation.navigate('EditProfile', { role: 'driver' }) },
        { label: 'Vehicle Details', icon: '🚗', onPress: () => navigation.navigate('VehicleDetails') },
        { label: 'Documents', icon: '📄', onPress: () => navigation.navigate('Documents') },
        { label: 'Earnings Report', icon: '💰', onPress: () => navigation.navigate('EarningsReport') },
        { label: 'Bank Details', icon: '🏦', onPress: () => navigation.navigate('BankDetails') },
        { label: 'Help & Support', icon: '❓', onPress: () => { } },
        { label: 'Settings', icon: '⚙️', onPress: () => { } },
    ];

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
                    <Text className="text-white text-2xl font-bold">Driver Profile</Text>
                </View>
            </View>

            <ScrollView className="flex-1">
                {/* Profile Header */}
                <View className="p-6 items-center border-b border-[#333]">
                    <View className="w-24 h-24 bg-[#1E1E1E] rounded-full items-center justify-center border-2 border-[#1DB954] mb-4">
                        <Text className="text-4xl">🚗</Text>
                    </View>
                    <Text className="text-white text-2xl font-bold">{profileData?.name || 'Driver Name'}</Text>
                    <Text className="text-[#A0A0A0]">{profileData?.email || 'driver@example.com'}</Text>
                    <View className="flex-row mt-4 space-x-4">
                        <View className="items-center px-4 border-r border-[#333]">
                            <Text className="text-white font-bold text-xl">245</Text>
                            <Text className="text-[#A0A0A0] text-xs">Deliveries</Text>
                        </View>
                        <View className="items-center px-4 border-r border-[#333]">
                            <Text className="text-white font-bold text-xl">4.9</Text>
                            <Text className="text-[#A0A0A0] text-xs">Rating</Text>
                        </View>
                        <View className="items-center px-4">
                            <Text className="text-white font-bold text-xl">96%</Text>
                            <Text className="text-[#A0A0A0] text-xs">On-Time</Text>
                        </View>
                    </View>
                </View>

                {/* Vehicle Info */}
                <View className="px-4 pt-6 pb-4">
                    <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4 ml-2">Vehicle Information</Text>
                    <View className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">Vehicle Type</Text>
                            <Text className="text-white font-semibold">Motorcycle</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">License Plate</Text>
                            <Text className="text-white font-semibold">ABC-1234</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-[#A0A0A0]">Insurance</Text>
                            <Text className="text-[#1DB954] font-semibold">✓ Valid</Text>
                        </View>
                    </View>
                </View>

                {/* Earnings Summary */}
                <View className="px-4 pb-4">
                    <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4 ml-2">Earnings Summary</Text>
                    <View className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">This Week</Text>
                            <Text className="text-[#1DB954] font-bold text-lg">$342.50</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">This Month</Text>
                            <Text className="text-white font-semibold">$1,287.00</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-[#A0A0A0]">Total Earnings</Text>
                            <Text className="text-white font-semibold">$8,540.00</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Items */}
                <View className="px-4 pb-6">
                    <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4 ml-2">Account</Text>
                    <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden mb-6">
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.label}
                                className={`flex-row items-center p-4 ${index !== menuItems.length - 1 ? 'border-b border-[#333]' : ''}`}
                                onPress={item.onPress}
                            >
                                <Text className="mr-4 text-xl">{item.icon}</Text>
                                <Text className="text-white text-lg flex-1">{item.label}</Text>
                                <Text className="text-[#666] text-xl">›</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Logout Button */}
                <View className="px-4 pb-10">
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center justify-center bg-[#1E1E1E] p-4 rounded-xl border border-red-900/30"
                    >
                        <Text className="text-red-500 font-bold text-lg">Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
