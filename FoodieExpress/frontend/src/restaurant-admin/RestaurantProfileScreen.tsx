import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { loadProfileData } from '../utils/profileUtils';

export default function RestaurantProfileScreen() {
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
        { label: 'Edit Restaurant Details', icon: '🏪', onPress: () => navigation.navigate('EditProfile', { role: 'restaurant' }) },
        { label: 'Business Hours', icon: '🕒', onPress: () => { } },
        { label: 'Restaurant Images', icon: '📸', onPress: () => { } },
        { label: 'Bank Details', icon: '🏦', onPress: () => { } },
        { label: 'Notifications', icon: '🔔', onPress: () => { } },
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
                    <Text className="text-white text-2xl font-bold">Restaurant Profile</Text>
                </View>
            </View>

            <ScrollView className="flex-1">
                {/* Restaurant Header */}
                <View className="p-6 items-center border-b border-[#333]">
                    <View className="w-24 h-24 bg-[#1E1E1E] rounded-full items-center justify-center border-2 border-[#1DB954] mb-4">
                        <Text className="text-4xl">🍔</Text>
                    </View>
                    <Text className="text-white text-2xl font-bold">Burger King</Text>
                    <Text className="text-[#A0A0A0] mb-1">Fast Food • Burgers</Text>
                    <Text className="text-[#666] text-sm">📍 123 Main Street, Downtown</Text>
                    <View className="flex-row mt-4 space-x-4">
                        <View className="items-center px-4 border-r border-[#333]">
                            <Text className="text-white font-bold text-xl">4.8</Text>
                            <Text className="text-[#A0A0A0] text-xs">Rating</Text>
                        </View>
                        <View className="items-center px-4 border-r border-[#333]">
                            <Text className="text-white font-bold text-xl">1.2k</Text>
                            <Text className="text-[#A0A0A0] text-xs">Reviews</Text>
                        </View>
                        <View className="items-center px-4">
                            <Text className="text-white font-bold text-xl">3.5k</Text>
                            <Text className="text-[#A0A0A0] text-xs">Orders</Text>
                        </View>
                    </View>
                </View>

                {/* Business Info */}
                <View className="px-4 pt-6 pb-4">
                    <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4 ml-2">Business Information</Text>
                    <View className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">Status</Text>
                            <Text className="text-[#1DB954] font-semibold">● Open Now</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">Opening Hours</Text>
                            <Text className="text-white font-semibold">9:00 AM - 11:00 PM</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">Contact</Text>
                            <Text className="text-white font-semibold">+1 234-567-8900</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-[#A0A0A0]">Email</Text>
                            <Text className="text-white font-semibold">info@burgerking.com</Text>
                        </View>
                    </View>
                </View>

                {/* Performance Summary */}
                <View className="px-4 pb-4">
                    <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4 ml-2">This Month</Text>
                    <View className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">Revenue</Text>
                            <Text className="text-[#1DB954] font-bold text-lg">$12,450</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">Total Orders</Text>
                            <Text className="text-white font-semibold">342</Text>
                        </View>
                        <View className="flex-row justify-between mb-3">
                            <Text className="text-[#A0A0A0]">Avg Order Value</Text>
                            <Text className="text-white font-semibold">$36.40</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-[#A0A0A0]">Customer Rating</Text>
                            <Text className="text-white font-semibold">4.8 ⭐</Text>
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
