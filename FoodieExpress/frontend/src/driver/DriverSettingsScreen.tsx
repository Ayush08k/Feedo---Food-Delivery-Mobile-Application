import React, { useState } from 'react';
import {
    View, Text, Switch, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function DriverSettingsScreen() {
    const navigation = useNavigation<any>();

    // Toggle states
    const [pushNotifications, setPushNotifications] = useState(true);
    const [orderAlerts, setOrderAlerts] = useState(true);
    const [earningsUpdates, setEarningsUpdates] = useState(true);
    const [locationTracking, setLocationTracking] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [autoAccept, setAutoAccept] = useState(false);
    const [showEarnings, setShowEarnings] = useState(true);

    const SettingToggle = ({
        icon, label, sublabel, value, onValueChange,
    }: {
        icon: string; label: string; sublabel?: string;
        value: boolean; onValueChange: (v: boolean) => void;
    }) => (
        <View style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: 16, paddingVertical: 14,
            borderBottomWidth: 1, borderBottomColor: '#2A2A2A',
        }}>
            <View style={{
                width: 40, height: 40, borderRadius: 12,
                backgroundColor: '#121212', alignItems: 'center',
                justifyContent: 'center', marginRight: 12,
            }}>
                <Text style={{ fontSize: 20 }}>{icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>{label}</Text>
                {sublabel && (
                    <Text style={{ color: '#666', fontSize: 12, marginTop: 1 }}>{sublabel}</Text>
                )}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: '#333', true: '#1DB954' }}
                thumbColor={value ? '#fff' : '#888'}
            />
        </View>
    );

    const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
        <View style={{ marginBottom: 20 }}>
            <Text style={{
                color: '#A0A0A0', fontSize: 11, fontWeight: 'bold',
                textTransform: 'uppercase', letterSpacing: 1,
                paddingHorizontal: 16, marginBottom: 8,
            }}>
                {title}
            </Text>
            <View style={{
                backgroundColor: '#1E1E1E', borderRadius: 16,
                overflow: 'hidden', borderWidth: 1, borderColor: '#333',
            }}>
                {children}
            </View>
        </View>
    );

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
                <View>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Settings</Text>
                    <Text style={{ color: '#A0A0A0', fontSize: 13 }}>App preferences</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>

                <Section title="Notifications">
                    <SettingToggle
                        icon="🔔" label="Push Notifications"
                        sublabel="Receive all app notifications"
                        value={pushNotifications} onValueChange={setPushNotifications}
                    />
                    <SettingToggle
                        icon="📦" label="New Order Alerts"
                        sublabel="Alert when a new order is available"
                        value={orderAlerts} onValueChange={setOrderAlerts}
                    />
                    <SettingToggle
                        icon="💰" label="Earnings Updates"
                        sublabel="Notify on payment received"
                        value={earningsUpdates} onValueChange={setEarningsUpdates}
                    />
                </Section>

                <Section title="Sound & Haptics">
                    <SettingToggle
                        icon="🔊" label="Sound Effects"
                        sublabel="Play sounds for alerts"
                        value={soundEnabled} onValueChange={setSoundEnabled}
                    />
                    <SettingToggle
                        icon="📳" label="Vibration"
                        sublabel="Vibrate on alerts"
                        value={vibrationEnabled} onValueChange={setVibrationEnabled}
                    />
                </Section>

                <Section title="Navigation & Tracking">
                    <SettingToggle
                        icon="📍" label="Location Tracking"
                        sublabel="Required for delivery tracking"
                        value={locationTracking} onValueChange={setLocationTracking}
                    />
                    <SettingToggle
                        icon="⚡" label="Auto-Accept Orders"
                        sublabel="Automatically accept matching orders"
                        value={autoAccept} onValueChange={setAutoAccept}
                    />
                </Section>

                <Section title="Display">
                    <SettingToggle
                        icon="🌙" label="Dark Mode"
                        sublabel="App dark theme (recommended)"
                        value={darkMode} onValueChange={setDarkMode}
                    />
                    <SettingToggle
                        icon="💵" label="Show Earnings on Home"
                        sublabel="Display earnings summary on dashboard"
                        value={showEarnings} onValueChange={setShowEarnings}
                    />
                </Section>

                {/* Language shortcut */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        color: '#A0A0A0', fontSize: 11, fontWeight: 'bold',
                        textTransform: 'uppercase', letterSpacing: 1,
                        paddingHorizontal: 16, marginBottom: 8,
                    }}>
                        Language
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('DriverLanguage')}
                        style={{
                            backgroundColor: '#1E1E1E', borderRadius: 16,
                            borderWidth: 1, borderColor: '#333',
                            flexDirection: 'row', alignItems: 'center',
                            paddingHorizontal: 16, paddingVertical: 14,
                        }}
                    >
                        <View style={{
                            width: 40, height: 40, borderRadius: 12,
                            backgroundColor: '#121212', alignItems: 'center',
                            justifyContent: 'center', marginRight: 12,
                        }}>
                            <Text style={{ fontSize: 20 }}>🌐</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: '500' }}>App Language</Text>
                            <Text style={{ color: '#666', fontSize: 12, marginTop: 1 }}>Select your preferred language</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />
            </ScrollView>
        </SafeAreaView>
    );
}
