import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { loadProfileData } from '../utils/profileUtils';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
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

        // Reload profile when screen comes into focus
        const unsubscribe = navigation.addListener('focus', () => {
            loadProfile();
        });

        return unsubscribe;
    }, [navigation]);

    const handleLogout = () => {
        // Reset navigation to Auth screen
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Auth' }],
            })
        );
    };

    const menuItems = [
        { label: 'Edit Profile', icon: '👤', onPress: () => navigation.navigate('EditProfile', { role: 'user' }) },
        { label: 'Payment Methods', icon: '💳', onPress: () => { } },
        { label: 'Address Book', icon: '📍', onPress: () => { } },
        { label: 'Order History', icon: '📜', onPress: () => { } },
        { label: 'Help & Support', icon: '❓', onPress: () => { } },
        { label: 'Settings', icon: '⚙️', onPress: () => { } },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="p-6 items-center border-b border-[#333]">
                <View className="w-24 h-24 bg-[#1E1E1E] rounded-full items-center justify-center border-2 border-[#1DB954] mb-4">
                    <Text className="text-4xl">👨‍🍳</Text>
                </View>
                <Text className="text-white text-2xl font-bold">{profileData?.name || 'John Doe'}</Text>
                <Text className="text-[#A0A0A0]">{profileData?.email || 'john.doe@example.com'}</Text>
                <View className="flex-row mt-4 space-x-4">
                    <View className="items-center px-4 border-r border-[#333]">
                        <Text className="text-white font-bold text-xl">12</Text>
                        <Text className="text-[#A0A0A0] text-xs">Orders</Text>
                    </View>
                    <View className="items-center px-4">
                        <Text className="text-white font-bold text-xl">4.8</Text>
                        <Text className="text-[#A0A0A0] text-xs">Rating</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-6">
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

                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center justify-center bg-[#1E1E1E] p-4 rounded-xl border border-red-900/30 mb-10"
                >
                    <Text className="text-red-500 font-bold text-lg">Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
