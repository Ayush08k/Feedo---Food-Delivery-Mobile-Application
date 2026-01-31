import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DriverDashboard from './DriverDashboard';
import DriverHomeScreen from './DriverHomeScreen';
import AvailableOrdersScreen from './AvailableOrdersScreen';
import DeliveryHistoryScreen from './DeliveryHistoryScreen';
import DriverProfileScreen from './DriverProfileScreen';
import DeliveryScreen from './DeliveryScreen';
import EditProfileScreen from '../profile/EditProfileScreen';
import VehicleDetailsScreen from './VehicleDetailsScreen';
import DocumentsScreen from './DocumentsScreen';
import EarningsReportScreen from './EarningsReportScreen';
import BankDetailsScreen from './BankDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DriverTabNavigator() {
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

                    if (route.name === 'Home') {
                        iconName = focused ? 'speedometer' : 'speedometer-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'History') {
                        iconName = focused ? 'time' : 'time-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else {
                        iconName = 'help';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={DriverHomeScreen} options={{ title: 'Dashboard' }} />
            <Tab.Screen name="Orders" component={AvailableOrdersScreen} options={{ title: 'Available' }} />
            <Tab.Screen name="History" component={DeliveryHistoryScreen} options={{ title: 'History' }} />
            <Tab.Screen name="Profile" component={DriverProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
}

export default function DriverNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DriverTabs" component={DriverTabNavigator} />
            <Stack.Screen name="AvailableOrders" component={AvailableOrdersScreen} />
            <Stack.Screen name="DeliveryHistory" component={DeliveryHistoryScreen} />
            <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
            <Stack.Screen name="DriverDelivery" component={DeliveryScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} />
            <Stack.Screen name="Documents" component={DocumentsScreen} />
            <Stack.Screen name="EarningsReport" component={EarningsReportScreen} />
            <Stack.Screen name="BankDetails" component={BankDetailsScreen} />
        </Stack.Navigator>
    );
}
