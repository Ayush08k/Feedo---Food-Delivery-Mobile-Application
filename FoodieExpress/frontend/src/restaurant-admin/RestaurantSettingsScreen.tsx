import React, { useState, useEffect } from 'react';
import {
    View, Text, Switch, TouchableOpacity, ScrollView, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../utils/UserContext';
import { useAlert } from '../utils/AlertContext';
import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.4:3000';

export default function RestaurantSettingsScreen() {
    const navigation = useNavigation<any>();
    const { profile } = useUser();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(true);

    // Toggle states
    const [pushNotifications, setPushNotifications] = useState(true);
    const [newOrderAlerts, setNewOrderAlerts] = useState(true);
    const [cancellationAlerts, setCancellationAlerts] = useState(true);
    const [earningsUpdates, setEarningsUpdates] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const fetchPreferences = async () => {
            if (!profile?.email) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}/users/preferences?email=${profile.email}`);
                const prefs = response.data;
                if (prefs) {
                    if (prefs.pushNotifications !== undefined) setPushNotifications(prefs.pushNotifications);
                    if (prefs.newOrderAlerts !== undefined) setNewOrderAlerts(prefs.newOrderAlerts);
                    if (prefs.cancellationAlerts !== undefined) setCancellationAlerts(prefs.cancellationAlerts);
                    if (prefs.earningsUpdates !== undefined) setEarningsUpdates(prefs.earningsUpdates);
                    if (prefs.soundEnabled !== undefined) setSoundEnabled(prefs.soundEnabled);
                }
            } catch (error) {
                console.error('Error fetching restaurant preferences', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPreferences();
    }, [profile]);

    const handleSave = async () => {
        if (!profile?.email) return;

        try {
            await axios.put(`${API_BASE_URL}/users/preferences`, {
                email: profile.email,
                preferences: {
                    pushNotifications,
                    newOrderAlerts,
                    cancellationAlerts,
                    earningsUpdates,
                    soundEnabled
                }
            });
            showAlert('Success', 'Restaurant settings saved!');
        } catch (error) {
            console.error('Error saving restaurant preferences', error);
            showAlert('Error', 'Failed to save settings.');
        }
    };

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
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingHorizontal: 16, paddingVertical: 16,
                borderBottomWidth: 1, borderBottomColor: '#333',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                        <Text style={{ color: '#A0A0A0', fontSize: 13 }}>Preferences & Notifications</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 16 }}>Save</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#1DB954" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>

                    <Section title="Order Notifications">
                        <SettingToggle
                            icon="🔔" label="Push Notifications"
                            sublabel="Receive all restaurant notifications"
                            value={pushNotifications} onValueChange={setPushNotifications}
                        />
                        <SettingToggle
                            icon="📦" label="New Order Alerts"
                            sublabel="Alert when a customer places an order"
                            value={newOrderAlerts} onValueChange={setNewOrderAlerts}
                        />
                        <SettingToggle
                            icon="❌" label="Cancellation Alerts"
                            sublabel="Notify when an order is cancelled"
                            value={cancellationAlerts} onValueChange={setCancellationAlerts}
                        />
                    </Section>

                    <Section title="Business Updates">
                        <SettingToggle
                            icon="💰" label="Earnings Updates"
                            sublabel="Get daily/weekly earnings reports"
                            value={earningsUpdates} onValueChange={setEarningsUpdates}
                        />
                    </Section>

                    <Section title="App Settings">
                        <SettingToggle
                            icon="🔊" label="Sound Effects"
                            sublabel="Play loud sound on new orders"
                            value={soundEnabled} onValueChange={setSoundEnabled}
                        />
                        <SettingToggle
                            icon="🌙" label="Dark Mode"
                            sublabel="App dark theme (recommended)"
                            value={darkMode} onValueChange={setDarkMode}
                        />
                    </Section>

                    <View style={{ height: 20 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
