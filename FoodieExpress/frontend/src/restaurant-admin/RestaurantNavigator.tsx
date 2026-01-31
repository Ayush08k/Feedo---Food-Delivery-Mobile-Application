import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import RestaurantDashboard from './RestaurantDashboard';
import RestaurantHomeScreen from './RestaurantHomeScreen';
import MenuManagementScreen from './MenuManagementScreen';
import RestaurantOffersScreen from './RestaurantOffersScreen';
import RestaurantProfileScreen from './RestaurantProfileScreen';
import EditProfileScreen from '../profile/EditProfileScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import OrderDetailsScreen from './OrderDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function RestaurantTabNavigator() {
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
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Menu') {
                        iconName = focused ? 'restaurant' : 'restaurant-outline';
                    } else if (route.name === 'Offers') {
                        iconName = focused ? 'pricetag' : 'pricetag-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    } else {
                        iconName = 'help';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={RestaurantHomeScreen} options={{ title: 'Dashboard' }} />
            <Tab.Screen name="Menu" component={MenuManagementScreen} options={{ title: 'Menu' }} />
            <Tab.Screen name="Offers" component={RestaurantOffersScreen} options={{ title: 'Offers' }} />
            <Tab.Screen name="Profile" component={RestaurantProfileScreen} options={{ title: 'Profile' }} />
        </Tab.Navigator>
    );
}

export default function RestaurantNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="RestaurantTabs" component={RestaurantTabNavigator} />
            <Stack.Screen name="MenuManagement" component={MenuManagementScreen} />
            <Stack.Screen name="RestaurantOffers" component={RestaurantOffersScreen} />
            <Stack.Screen name="RestaurantProfile" component={RestaurantProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
        </Stack.Navigator>
    );
}
