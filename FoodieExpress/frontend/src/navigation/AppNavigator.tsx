import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import AuthScreen from '../auth/AuthScreen';
import RestaurantDetailsScreen from '../restaurant/RestaurantDetailsScreen';
import CheckoutScreen from '../cart/CheckoutScreen';
import CategoriesScreen from '../home/CategoriesScreen';
import OfferDetailsScreen from '../home/OfferDetailsScreen';
import FoodItemDetailsScreen from '../menu/FoodItemDetailsScreen';
import SearchResultsScreen from '../home/SearchResultsScreen';

import DriverNavigator from '../driver/DriverNavigator';
import RestaurantNavigator from '../restaurant-admin/RestaurantNavigator';
import DeliveryScreen from '../driver/DeliveryScreen';
import EditProfileScreen from '../profile/EditProfileScreen';

import RoleSelectionScreen from '../auth/RoleSelectionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#121212' },
                animation: 'fade'
            }}
        >
            <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
            <Stack.Screen
                name="Categories"
                component={CategoriesScreen}
                options={{
                    animation: 'fade_from_bottom',
                    presentation: 'transparentModal',
                    contentStyle: { backgroundColor: '#121212' }
                }}
            />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="OfferDetails" component={OfferDetailsScreen} />
            <Stack.Screen name="FoodItemDetails" component={FoodItemDetailsScreen} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />

            {/* Driver App */}
            <Stack.Screen name="DriverApp" component={DriverNavigator} />
            <Stack.Screen name="DriverDelivery" component={DeliveryScreen} />

            {/* Restaurant App */}
            <Stack.Screen name="RestaurantApp" component={RestaurantNavigator} />
        </Stack.Navigator>
    );
}
