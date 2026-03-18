import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { loadProfileData } from '../utils/profileUtils';
import { useLanguage } from '../utils/LanguageContext';

export default function DriverProfileScreen() {
    const navigation = useNavigation<any>();
    const [profileData, setProfileData] = useState<any>(null);
    const { currentLangMeta } = useLanguage();

    useEffect(() => {
        const loadProfile = async () => {
            const data = await loadProfileData();
            if (data) setProfileData(data);
        };
        loadProfile();
        const unsubscribe = navigation.addListener('focus', loadProfile);
        return unsubscribe;
    }, [navigation]);

    const handleLogout = () => {
        navigation.dispatch(
            CommonActions.reset({ index: 0, routes: [{ name: 'Auth' }] })
        );
    };

    const accountItems = [
        { label: 'Edit Profile',    icon: '👤', onPress: () => navigation.navigate('EditProfile', { role: 'driver' }) },
        { label: 'Vehicle Details', icon: '🚗', onPress: () => navigation.navigate('VehicleDetails') },
        { label: 'Documents',       icon: '📄', onPress: () => navigation.navigate('Documents') },
    ];

    const earningsItems = [
        { label: 'Earnings Report', icon: '💰', onPress: () => navigation.navigate('EarningsReport') },
        { label: 'Bank Details',    icon: '🏦', onPress: () => navigation.navigate('BankDetails') },
    ];

    const appItems = [
        {
            label: 'Settings', icon: '⚙️',
            onPress: () => navigation.navigate('DriverSettings'),
        },
        {
            label: 'Language', icon: currentLangMeta.flag,
            badge: currentLangMeta.nativeName,
            onPress: () => navigation.navigate('DriverLanguage'),
        },
        {
            label: 'Send Feedback', icon: '📝',
            onPress: () => navigation.navigate('DriverFeedback'),
        },
    ];

    const renderSection = (title: string, items: any[]) => (
        <View style={{ marginBottom: 20 }}>
            <Text style={{
                color: '#A0A0A0', fontSize: 11, fontWeight: 'bold',
                textTransform: 'uppercase', letterSpacing: 1,
                marginBottom: 8, marginLeft: 4,
            }}>
                {title}
            </Text>
            <View style={{
                backgroundColor: '#1E1E1E', borderRadius: 16,
                overflow: 'hidden', borderWidth: 1, borderColor: '#333',
            }}>
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={item.label}
                        onPress={item.onPress}
                        style={{
                            flexDirection: 'row', alignItems: 'center',
                            padding: 16,
                            borderBottomWidth: index !== items.length - 1 ? 1 : 0,
                            borderBottomColor: '#333',
                        }}
                    >
                        <View style={{
                            width: 40, height: 40, borderRadius: 12,
                            backgroundColor: '#121212', alignItems: 'center',
                            justifyContent: 'center', marginRight: 12,
                        }}>
                            <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                        </View>
                        <Text style={{ color: '#fff', fontSize: 15, flex: 1 }}>{item.label}</Text>
                        {item.badge && (
                            <Text style={{ color: '#A0A0A0', fontSize: 12, marginRight: 8 }}>{item.badge}</Text>
                        )}
                        <Ionicons name="chevron-forward" size={18} color="#555" />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            {/* Header */}
            <View style={{
                paddingHorizontal: 16, paddingVertical: 16,
                borderBottomWidth: 1, borderBottomColor: '#333',
            }}>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Driver Profile</Text>
            </View>

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={{ padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#333' }}>
                    <View style={{
                        width: 90, height: 90, borderRadius: 45,
                        backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: '#1DB954', marginBottom: 12,
                    }}>
                        <Text style={{ fontSize: 40 }}>🚗</Text>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
                        {profileData?.name || 'Driver Name'}
                    </Text>
                    <Text style={{ color: '#A0A0A0' }}>{profileData?.email || 'driver@example.com'}</Text>

                    <View style={{ flexDirection: 'row', marginTop: 16 }}>
                        <View style={{ alignItems: 'center', paddingHorizontal: 20, borderRightWidth: 1, borderRightColor: '#333' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>245</Text>
                            <Text style={{ color: '#A0A0A0', fontSize: 12 }}>Deliveries</Text>
                        </View>
                        <View style={{ alignItems: 'center', paddingHorizontal: 20, borderRightWidth: 1, borderRightColor: '#333' }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>4.9</Text>
                            <Text style={{ color: '#A0A0A0', fontSize: 12 }}>Rating</Text>
                        </View>
                        <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
                            <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 20 }}>96%</Text>
                            <Text style={{ color: '#A0A0A0', fontSize: 12 }}>On-Time</Text>
                        </View>
                    </View>
                </View>

                {/* Vehicle Info */}
                <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 4 }}>
                    <Text style={{
                        color: '#A0A0A0', fontSize: 11, fontWeight: 'bold',
                        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4,
                    }}>
                        Vehicle Information
                    </Text>
                    <View style={{
                        backgroundColor: '#1E1E1E', borderRadius: 16,
                        borderWidth: 1, borderColor: '#333', padding: 16, marginBottom: 20,
                    }}>
                        {[
                            { label: 'Vehicle Type', value: 'Motorcycle' },
                            { label: 'License Plate', value: 'ABC-1234' },
                            { label: 'Insurance',     value: '✓ Valid', green: true },
                        ].map(r => (
                            <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ color: '#A0A0A0' }}>{r.label}</Text>
                                <Text style={{ color: r.green ? '#1DB954' : '#fff', fontWeight: '500' }}>{r.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Earnings Summary */}
                    <Text style={{
                        color: '#A0A0A0', fontSize: 11, fontWeight: 'bold',
                        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4,
                    }}>
                        Earnings Summary
                    </Text>
                    <View style={{
                        backgroundColor: '#1E1E1E', borderRadius: 16,
                        borderWidth: 1, borderColor: '#333', padding: 16, marginBottom: 20,
                    }}>
                        {[
                            { label: 'This Week',     value: '$342.50',   green: true },
                            { label: 'This Month',    value: '$1,287.00', green: false },
                            { label: 'Total Earnings',value: '$8,540.00', green: false },
                        ].map(r => (
                            <View key={r.label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text style={{ color: '#A0A0A0' }}>{r.label}</Text>
                                <Text style={{ color: r.green ? '#1DB954' : '#fff', fontWeight: 'bold' }}>{r.value}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Sections */}
                    {renderSection('Account', accountItems)}
                    {renderSection('Earnings', earningsItems)}
                    {renderSection('App', appItems)}

                    {/* Logout */}
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                            backgroundColor: '#1E1E1E', padding: 16, borderRadius: 14,
                            borderWidth: 1, borderColor: '#7F1D1D44', marginBottom: 8,
                        }}
                    >
                        <Text style={{ fontSize: 20, marginRight: 8 }}>🚪</Text>
                        <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 16 }}>Log Out</Text>
                    </TouchableOpacity>

                    <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                        <Text style={{ color: '#444', fontSize: 12 }}>Feedo – Driver App v1.0.0</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
