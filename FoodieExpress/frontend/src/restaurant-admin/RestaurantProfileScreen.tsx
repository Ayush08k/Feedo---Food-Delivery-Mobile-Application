import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { loadProfileData } from '../utils/profileUtils';
import { useAlert } from '../utils/AlertContext';
import UniversalMap from '../components/UniversalMap';

export default function RestaurantProfileScreen() {
    const navigation = useNavigation<any>();
    const [profileData, setProfileData] = useState<any>(null);
    const { showAlert } = useAlert();

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
        { label: 'Business Hours', icon: '🕒', onPress: () => showAlert('Business Hours', 'Current hours: Mon-Fri 9:00 AM - 11:00 PM\nSat-Sun 10:00 AM - 10:00 PM\n\nContact support to update your hours.') },
        { label: 'Restaurant Images', icon: '📸', onPress: () => showAlert('Restaurant Images', 'Upload photos of your restaurant and food items to attract more customers. Use Edit Profile to update your images.') },
        { label: 'Bank Details', icon: '🏦', onPress: () => showAlert('Bank Details', 'Bank Account: **** **** 4242\nAccount Holder: Burger King Ltd\nIFSC: HDFC0001234\n\nContact support to update bank details.') },
        { label: 'Notifications', icon: '🔔', onPress: () => navigation.navigate('RestaurantSettings') },
        { label: 'Help & Support', icon: '❓', onPress: () => showAlert('Help & Support', 'Contact us:\n\nEmail: support@feedo.app\nPhone: +1-800-FEEDO-01\n\nLive chat is available 24/7 in the app.') },
        { label: 'Settings', icon: '⚙️', onPress: () => navigation.navigate('RestaurantSettings') },
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

                {/* 🗺️ OSM Restaurant Location Map */}
                <View className="px-4 pt-6 pb-2">
                    <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-4 ml-2">Restaurant Location</Text>
                    <View className="rounded-2xl overflow-hidden border border-[#333] mb-3" style={{ height: 180 }}>
                        <UniversalMap
                            lat={17.3850}
                            lng={78.4867}
                            zoom={15}
                            markers={[{ id: 'restaurant', lat: 17.3850, lng: 78.4867, title: 'Burger King' }]}
                        />
                    </View>
                    <TouchableOpacity
                        className="bg-[#1E1E1E] border border-[#1DB954] p-3 rounded-xl flex-row items-center justify-center mb-2"
                        onPress={() => Linking.openURL('https://www.openstreetmap.org/?mlat=17.3850&mlon=78.4867&zoom=15')}
                    >
                        <Text className="text-[#1DB954] font-bold mr-2">🧭</Text>
                        <Text className="text-[#1DB954] font-bold">View on OpenStreetMap</Text>
                    </TouchableOpacity>
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
