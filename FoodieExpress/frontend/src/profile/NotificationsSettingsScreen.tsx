import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';

export default function NotificationsSettingsScreen() {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();

    const [orderUpdates, setOrderUpdates] = useState(true);
    const [promotions, setPromotions] = useState(true);
    const [newRestaurants, setNewRestaurants] = useState(false);
    const [orderReminders, setOrderReminders] = useState(true);
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

    const handleSave = () => {
        showAlert('Success', 'Notification preferences saved!');
    };

    const renderToggle = (value: boolean, onToggle: () => void) => (
        <TouchableOpacity
            className={`w-14 h-8 rounded-full ${value ? 'bg-[#1DB954]' : 'bg-[#666]'} justify-center`}
            onPress={onToggle}
        >
            <View className={`w-6 h-6 bg-white rounded-full ${value ? 'self-end mr-1' : 'self-start ml-1'}`} />
        </TouchableOpacity>
    );

    const renderSettingItem = (
        icon: string,
        title: string,
        description: string,
        value: boolean,
        onToggle: () => void
    ) => (
        <View className="mb-4 bg-[#1E1E1E] rounded-xl p-4 border border-[#333]">
            <View className="flex-row items-start justify-between">
                <View className="flex-1 mr-4">
                    <View className="flex-row items-center mb-2">
                        <Text className="text-xl mr-2">{icon}</Text>
                        <Text className="text-white font-bold text-base">{title}</Text>
                    </View>
                    <Text className="text-[#A0A0A0] text-sm">{description}</Text>
                </View>
                {renderToggle(value, onToggle)}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 border-b border-[#333] flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                        <Text className="text-[#1DB954] text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Notifications</Text>
                </View>
                <TouchableOpacity onPress={handleSave}>
                    <Text className="text-[#1DB954] font-bold">Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {/* Order Notifications */}
                <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-3 ml-2">
                    Order Notifications
                </Text>

                {renderSettingItem(
                    '📦',
                    'Order Updates',
                    'Get notified about your order status, including preparation, dispatch, and delivery',
                    orderUpdates,
                    () => setOrderUpdates(!orderUpdates)
                )}

                {renderSettingItem(
                    '⏰',
                    'Order Reminders',
                    'Receive reminders about incomplete orders and cart items',
                    orderReminders,
                    () => setOrderReminders(!orderReminders)
                )}

                {/* Marketing Notifications */}
                <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-3 ml-2 mt-4">
                    Marketing & Offers
                </Text>

                {renderSettingItem(
                    '🎁',
                    'Promotions & Offers',
                    'Receive notifications about special deals, discounts, and promotional offers',
                    promotions,
                    () => setPromotions(!promotions)
                )}

                {renderSettingItem(
                    '🆕',
                    'New Restaurants',
                    'Get notified when new restaurants are added in your area',
                    newRestaurants,
                    () => setNewRestaurants(!newRestaurants)
                )}

                {/* Notification Channels */}
                <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-3 ml-2 mt-4">
                    Notification Channels
                </Text>

                {renderSettingItem(
                    '🔔',
                    'Push Notifications',
                    'Receive notifications directly on your device',
                    pushNotifications,
                    () => setPushNotifications(!pushNotifications)
                )}

                {renderSettingItem(
                    '📧',
                    'Email Notifications',
                    'Receive updates and offers via email',
                    emailNotifications,
                    () => setEmailNotifications(!emailNotifications)
                )}

                {renderSettingItem(
                    '💬',
                    'SMS Notifications',
                    'Receive order updates via text messages',
                    smsNotifications,
                    () => setSmsNotifications(!smsNotifications)
                )}

                {/* Info Box */}
                <View className="mt-6 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                    <Text className="text-white font-bold mb-2">ℹ️ About Notifications</Text>
                    <Text className="text-[#A0A0A0] text-sm">
                        You can customize your notification preferences at any time. Critical order updates will always be sent regardless of your settings to ensure you don't miss important information about your deliveries.
                    </Text>
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
