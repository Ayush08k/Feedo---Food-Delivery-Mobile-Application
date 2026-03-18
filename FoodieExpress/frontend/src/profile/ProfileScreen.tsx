import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { useUser } from '../utils/UserContext';
import { useAlert } from '../utils/AlertContext';
import { useLanguage } from '../utils/LanguageContext';

export default function ProfileScreen() {
    const navigation = useNavigation<any>();
    const { profile, refreshProfile } = useUser();
    const { showAlert } = useAlert();
    const { t, currentLangMeta } = useLanguage();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refreshProfile();
        });
        return unsubscribe;
    }, [navigation]);

    const handleLogout = () => {
        showAlert(
            t('profile.logout'),
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: t('profile.logout'),
                    style: 'destructive',
                    onPress: () => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Auth' }],
                            })
                        );
                    }
                }
            ]
        );
    };

    const showComingSoon = (feature: string) => {
        showAlert('Coming Soon', `${feature} feature will be available soon!`);
    };

    const accountItems = [
        { label: t('profile.editProfile'),      icon: '👤', onPress: () => navigation.navigate('EditProfile', { role: 'user' }) },
        { label: t('profile.manageAddresses'),  icon: '📍', onPress: () => navigation.navigate('ManageAddresses') },
    ];

    const orderItems = [
        { label: t('profile.yourOrders'),       icon: '📦', onPress: () => navigation.navigate('YourOrders') },
        { label: t('profile.favouriteOrders'),  icon: '❤️', onPress: () => navigation.navigate('Favourites') },
    ];

    const paymentItems = [
        { label: t('profile.paymentMethods'),   icon: '💳', onPress: () => navigation.navigate('PaymentMethods') },
    ];

    const settingsItems = [
        { label: t('profile.notifications'),    icon: '🔔', onPress: () => navigation.navigate('NotificationsSettings') },
        {
            label: t('profile.language'),
            icon: currentLangMeta.flag,
            onPress: () => navigation.navigate('Language'),
            badge: currentLangMeta.nativeName,
        },
    ];

    const moreItems = [
        { label: t('profile.about'),    icon: 'ℹ️', onPress: () => navigation.navigate('About') },
        { label: t('profile.feedback'), icon: '📝', onPress: () => navigation.navigate('Feedback') },
    ];

    const renderMenuSection = (title: string, items: any[]) => (
        <View className="mb-6">
            <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-3 ml-2">{title}</Text>
            <View className="bg-[#1E1E1E] rounded-2xl overflow-hidden">
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={item.label}
                        className={`flex-row items-center p-4 ${index !== items.length - 1 ? 'border-b border-[#333]' : ''}`}
                        onPress={item.onPress}
                    >
                        <View className="w-10 h-10 bg-[#121212] rounded-full items-center justify-center mr-4">
                            <Text className="text-xl">{item.icon}</Text>
                        </View>
                        <Text className="text-white text-base flex-1">{item.label}</Text>
                        {item.badge && (
                            <Text className="text-[#A0A0A0] text-sm mr-2">{item.badge}</Text>
                        )}
                        <Text className="text-[#666] text-xl">›</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Profile Header */}
            <View className="p-6 items-center border-b border-[#333]">
                <View className="w-24 h-24 bg-[#1E1E1E] rounded-full items-center justify-center border-2 border-[#1DB954] mb-4 overflow-hidden">
                    {profile?.profileImage ? (
                        <Image source={{ uri: profile.profileImage }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <Text className="text-4xl">👨‍🍳</Text>
                    )}
                </View>
                <Text className="text-white text-2xl font-bold">{profile?.name || 'John Doe'}</Text>
                <Text className="text-[#A0A0A0]">{profile?.email || 'john.doe@example.com'}</Text>
                {profile?.phone && (
                    <Text className="text-[#666] text-sm mt-1">📱 {profile.phone}</Text>
                )}
                <View className="flex-row mt-4 space-x-4">
                    <View className="items-center px-4 border-r border-[#333]">
                        <Text className="text-white font-bold text-xl">12</Text>
                        <Text className="text-[#A0A0A0] text-xs">{t('profile.orders')}</Text>
                    </View>
                    <View className="items-center px-4">
                        <Text className="text-white font-bold text-xl">4.8</Text>
                        <Text className="text-[#A0A0A0] text-xs">{t('profile.rating')}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
                {renderMenuSection(t('profile.account'),    accountItems)}
                {renderMenuSection(t('profile.foodOrders'), orderItems)}
                {renderMenuSection(t('profile.payments'),   paymentItems)}
                {renderMenuSection(t('profile.settings'),   settingsItems)}
                {renderMenuSection(t('profile.moreInfo'),   moreItems)}

                {/* Logout */}
                <TouchableOpacity
                    onPress={handleLogout}
                    className="flex-row items-center justify-center bg-[#1E1E1E] p-4 rounded-xl border border-red-900/30 mb-4"
                >
                    <Text className="text-xl mr-2">🚪</Text>
                    <Text className="text-red-500 font-bold text-lg">{t('profile.logout')}</Text>
                </TouchableOpacity>

                <View className="items-center py-6 mb-4">
                    <Text className="text-[#666] text-xs">Feedo</Text>
                    <Text className="text-[#666] text-xs mt-1">Version 1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
