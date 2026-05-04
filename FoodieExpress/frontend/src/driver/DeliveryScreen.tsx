import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';
import { useSocket } from '../utils/SocketContext';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import UniversalMap from '../components/UniversalMap';

// Dummy coordinates for demo
const DESTINATIONS = {
    restaurant: { name: 'Burger King', lat: 17.3850, lng: 78.4867, address: '456 Wall St' },
    customer: { name: 'John Customer', lat: 17.4050, lng: 78.5067, address: '789 Residential Ave, Apt 4B' }
};

export default function DeliveryScreen() {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();
    const { socket } = useSocket();
    const [step, setStep] = useState(0); // 0: To Restaurant, 1: To Customer

    const currentDest = step === 0 ? DESTINATIONS.restaurant : DESTINATIONS.customer;

    // Real-time location broadcasting
    useEffect(() => {
        let locationSubscription: any;
        
        if (step === 1 && socket) { // Driver is on delivery to customer
            (async () => {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status === 'granted') {
                    locationSubscription = await Location.watchPositionAsync(
                        { 
                            accuracy: Location.Accuracy.High, 
                            distanceInterval: 10,
                            timeInterval: 5000 
                        },
                        (location) => {
                            socket.emit('location_update', {
                                orderId: '1234', // Demo order ID
                                lat: location.coords.latitude,
                                lng: location.coords.longitude
                            });
                        }
                    );
                }
            })();
        }
        
        return () => {
            if (locationSubscription) locationSubscription.remove();
        };
    }, [step, socket]);

    const handleAction = () => {
        if (step === 0) {
            showAlert('Order Picked Up', 'Proceed to customer location.');
            setStep(1);
        } else {
            showAlert('Delivered!', 'Good job. Earnings updated.');
            navigation.goBack();
        }
    };

    const handleNavigate = async () => {
        const url = `https://share.here.com/r/${currentDest.lat},${currentDest.lng}`;
        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            Alert.alert('Error', 'Unable to open HERE WeGo. Please ensure you have a browser or the app installed.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="p-4 border-b border-[#333] flex-row justify-between items-center">
                <Text className="text-white text-xl font-bold">Current Delivery</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Live HERE Map */}
            <View className="h-1/3 border-b border-[#333] relative">
                <UniversalMap lat={currentDest.lat} lng={currentDest.lng} />
                
                {/* Floating Navigate Button on Map */}
                <TouchableOpacity 
                    className="absolute bottom-4 right-4 bg-[#1DB954] p-4 rounded-full shadow-lg shadow-black"
                    onPress={handleNavigate}
                >
                    <Ionicons name="navigate" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="mb-6">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-2">
                                {step === 0 ? 'Pick Up At' : 'Deliver To'}
                            </Text>
                            <Text className="text-white text-2xl font-bold mb-1">
                                {currentDest.name}
                            </Text>
                            <Text className="text-[#A0A0A0] text-lg">
                                {currentDest.address}
                            </Text>
                        </View>
                        <TouchableOpacity 
                            className="bg-[#333] p-3 rounded-xl flex-row items-center"
                            onPress={handleNavigate}
                        >
                            <Ionicons name="map" size={20} color="#1DB954" className="mr-2" />
                            <Text className="text-white font-bold ml-2">HERE WeGo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-6">
                    <Text className="text-white font-bold mb-2">Order #1234 Details</Text>
                    <View className="flex-row justify-between">
                        <Text className="text-[#A0A0A0]">2x Whopper Meal</Text>
                        <Text className="text-[#A0A0A0]">1x Coke Zero</Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="p-4 rounded-xl items-center bg-[#1DB954]"
                    onPress={handleAction}
                >
                    <Text className="text-black font-bold text-lg">
                        {step === 0 ? 'Confirm Pickup' : 'Complete Delivery'}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

