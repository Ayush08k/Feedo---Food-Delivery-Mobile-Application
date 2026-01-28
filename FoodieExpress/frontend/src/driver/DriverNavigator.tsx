import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DriverDashboard from './DriverDashboard';
import ProfileScreen from '../profile/ProfileScreen'; // Reusing Profile
import DeliveryScreen from './DeliveryScreen';

const Tab = createBottomTabNavigator();

export default function DriverNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#121212',
                    borderTopWidth: 1,
                    borderTopColor: '#333',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#1DB954',
                tabBarInactiveTintColor: '#A0A0A0',
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'speedometer' : 'speedometer-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else if (route.name === 'DriverDelivery') { // Not usually in tab, but for testing
                        iconName = 'navigate';
                    } else {
                        iconName = 'help';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={DriverDashboard} />
            {/* Delivery Screen is active task, maybe shouldn't be a tab but stack, doing stack inside AppNavigator is better.
                For now I'll hide it or just not add it to tabs if accessed via Dashboard.
                Wait, I need to register it somewhere if I use navigation.navigate('DriverDelivery').
                I will add it to the stack in AppNavigator instead or add here as a button. 
                Let's add it to the AppNavigator stack or make this a stack navigator inside. 
                Actually, simpler: Register it in AppNavigator stack.
            */}
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
