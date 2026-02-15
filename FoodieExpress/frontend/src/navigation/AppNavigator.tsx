import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import AuthScreen from '../auth/AuthScreen';
import RestaurantDetailsScreen from '../restaurant/RestaurantDetailsScreen';
import RestaurantsListScreen from '../restaurant/RestaurantsListScreen';
import CheckoutScreen from '../cart/CheckoutScreen';
import CategoriesScreen from '../home/CategoriesScreen';
import OfferDetailsScreen from '../home/OfferDetailsScreen';
import BestOffersScreen from '../home/BestOffersScreen';
import FoodItemDetailsScreen from '../menu/FoodItemDetailsScreen';
import SearchResultsScreen from '../home/SearchResultsScreen';
import YourOrdersScreen from '../profile/YourOrdersScreen';
import ManageAddressesScreen from '../profile/ManageAddressesScreen';
import AddAddressScreen from '../profile/AddAddressScreen';
import PaymentMethodsScreen from '../profile/PaymentMethodsScreen';
import NotificationsSettingsScreen from '../profile/NotificationsSettingsScreen';
import RateOrderScreen from '../profile/RateOrderScreen';

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
            <Stack.Screen name="RestaurantsList" component={RestaurantsListScreen} />
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
            <Stack.Screen name="BestOffers" component={BestOffersScreen} />
            <Stack.Screen name="FoodItemDetails" component={FoodItemDetailsScreen} />
            <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="YourOrders" component={YourOrdersScreen} />
            <Stack.Screen name="RateOrder" component={RateOrderScreen} />
            <Stack.Screen name="ManageAddresses" component={ManageAddressesScreen} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} />
            <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
            <Stack.Screen name="NotificationsSettings" component={NotificationsSettingsScreen} />

            {/* Driver App */}
            <Stack.Screen name="DriverApp" component={DriverNavigator} />
            <Stack.Screen name="DriverDelivery" component={DeliveryScreen} />

            {/* Restaurant App */}
            <Stack.Screen name="RestaurantApp" component={RestaurantNavigator} />
        </Stack.Navigator>
    );
}
