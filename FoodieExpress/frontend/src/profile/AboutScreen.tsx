import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const APP_VERSION = '1.0.0';

const INFO_ITEMS = [
    { label: 'App Name', value: 'Feedo – Food Delivery' },
    { label: 'Version', value: APP_VERSION },
    { label: 'Platform', value: 'React Native (Expo)' },
    { label: 'Developer', value: 'Ayush Kumar' },
    { label: 'Contact', value: 'ayushkumar2467@gmail.com' },
    { label: 'GitHub', value: 'github.com/Ayush08k' },
];

export default function AboutScreen() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 16,
                borderBottomWidth: 1, borderBottomColor: '#333',
            }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        width: 40, height: 40, borderRadius: 20,
                        backgroundColor: '#1E1E1E', alignItems: 'center',
                        justifyContent: 'center', marginRight: 12,
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>About</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                {/* Logo / Icon area */}
                <View style={{ alignItems: 'center', marginBottom: 28 }}>
                    <View style={{
                        width: 90, height: 90, borderRadius: 22,
                        backgroundColor: '#1DB954', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 12,
                        shadowColor: '#1DB954', shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
                    }}>
                        <Text style={{ fontSize: 44 }}>🍔</Text>
                    </View>
                    <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>Feedo</Text>
                    <Text style={{ color: '#A0A0A0', fontSize: 13, marginTop: 2 }}>Food Delivery at your fingertips</Text>
                    <View style={{
                        marginTop: 8, backgroundColor: '#1DB95420', paddingHorizontal: 14,
                        paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: '#1DB95440',
                    }}>
                        <Text style={{ color: '#1DB954', fontSize: 12, fontWeight: 'bold' }}>v{APP_VERSION}</Text>
                    </View>
                </View>

                {/* Info Table */}
                <View style={{
                    backgroundColor: '#1E1E1E', borderRadius: 16,
                    borderWidth: 1, borderColor: '#333', overflow: 'hidden', marginBottom: 20,
                }}>
                    {INFO_ITEMS.map((item, index) => (
                        <View
                            key={item.label}
                            style={{
                                flexDirection: 'row', alignItems: 'center',
                                padding: 14,
                                borderBottomWidth: index !== INFO_ITEMS.length - 1 ? 1 : 0,
                                borderBottomColor: '#333',
                            }}
                        >
                            <Text style={{ color: '#A0A0A0', fontSize: 14, width: 110 }}>{item.label}</Text>
                            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500', flex: 1 }}>{item.value}</Text>
                        </View>
                    ))}
                </View>

                {/* Description */}
                <View style={{
                    backgroundColor: '#1E1E1E', borderRadius: 16,
                    borderWidth: 1, borderColor: '#333', padding: 16, marginBottom: 20,
                }}>
                    <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 15, marginBottom: 8 }}>
                        About Feedo
                    </Text>
                    <Text style={{ color: '#A0A0A0', fontSize: 14, lineHeight: 22 }}>
                        Feedo is a modern food delivery platform that connects customers with their favourite restaurants. 
                        Order food, track deliveries in real-time, and manage your entire experience from one app.
                        {'\n\n'}
                        Built with React Native (Expo) on the frontend and NestJS on the backend, Feedo is designed for performance, reliability and a premium user experience.
                    </Text>
                </View>

                <Text style={{ color: '#555', fontSize: 12, textAlign: 'center', marginBottom: 8 }}>
                    Made with ❤️ by Ayush Kumar
                </Text>
                <Text style={{ color: '#444', fontSize: 11, textAlign: 'center' }}>
                    © 2025 Feedo. All rights reserved.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}
