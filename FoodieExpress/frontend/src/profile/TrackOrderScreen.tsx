import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSocket } from '../utils/SocketContext';
import UniversalMap from '../components/UniversalMap';

export default function TrackOrderScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { socket } = useSocket();
    const orderId = route.params?.orderId || '1234';

    const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [customerLocation] = useState({ lat: 17.4050, lng: 78.5067 }); // Demo customer location
    const [routeGeoJSON, setRouteGeoJSON] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (socket) {
            socket.emit('joinRoom', orderId);

            socket.on('driver_location', (data: { lat: number, lng: number }) => {
                setDriverLocation(data);
                updateRoute(data, customerLocation);
            });
        }

        // Mock initial driver location for demo if not received yet
        setDriverLocation({ lat: 17.3850, lng: 78.4867 });
        updateRoute({ lat: 17.3850, lng: 78.4867 }, customerLocation);

        return () => {
            if (socket) socket.off('driver_location');
        };
    }, [socket, orderId]);

    const updateRoute = async (start: { lat: number, lng: number }, end: { lat: number, lng: number }) => {
        try {
            const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.routes && data.routes.length > 0) {
                setRouteGeoJSON(data.routes[0].geometry);
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="px-4 py-4 flex-row items-center border-b border-[#333]">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="#1DB954" />
                </TouchableOpacity>
                <View>
                    <Text className="text-white text-xl font-bold">Track Your Order</Text>
                    <Text className="text-[#A0A0A0] text-xs">Order #{orderId}</Text>
                </View>
            </View>

            <View className="h-2/5 border-b border-[#333]">
                <UniversalMap 
                    lat={customerLocation.lat}
                    lng={customerLocation.lng}
                    markers={[
                        { id: 'driver', lat: driverLocation?.lat || 17.3850, lng: driverLocation?.lng || 78.4867, title: 'Driver' },
                        { id: 'customer', lat: customerLocation.lat, lng: customerLocation.lng, title: 'You' }
                    ]}
                    routeGeoJSON={routeGeoJSON}
                    zoom={13}
                />
            </View>

            <ScrollView className="flex-1 p-4">
                <View className="flex-row items-center mb-6 bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                    <View className="w-12 h-12 rounded-full bg-[#1DB954] items-center justify-center mr-4">
                        <Ionicons name="bicycle" size={24} color="black" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg">Alex is on the way!</Text>
                        <Text className="text-[#A0A0A0]">Estimated arrival: 8-12 mins</Text>
                    </View>
                    <TouchableOpacity className="bg-[#333] p-3 rounded-full">
                        <Ionicons name="call" size={20} color="#1DB954" />
                    </TouchableOpacity>
                </View>

                <Text className="text-white font-bold text-lg mb-4">Delivery Progress</Text>
                
                <View className="relative">
                    <View className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#333]" />
                    
                    <View className="flex-row items-center mb-8 pl-1">
                        <View className="w-6 h-6 rounded-full bg-[#1DB954] items-center justify-center z-10">
                            <Ionicons name="checkmark" size={14} color="black" />
                        </View>
                        <View className="ml-4">
                            <Text className="text-white font-bold">Order Received</Text>
                            <Text className="text-[#A0A0A0] text-sm">1:45 PM</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-8 pl-1">
                        <View className="w-6 h-6 rounded-full bg-[#1DB954] items-center justify-center z-10">
                            <Ionicons name="checkmark" size={14} color="black" />
                        </View>
                        <View className="ml-4">
                            <Text className="text-white font-bold">Order Prepared</Text>
                            <Text className="text-[#A0A0A0] text-sm">2:05 PM</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-8 pl-1">
                        <View className="w-6 h-6 rounded-full bg-[#1DB954] border-2 border-white items-center justify-center z-10">
                            <View className="w-2 h-2 rounded-full bg-white" />
                        </View>
                        <View className="ml-4">
                            <Text className="text-[#1DB954] font-bold">Alex picked up your order</Text>
                            <Text className="text-[#A0A0A0] text-sm">Just now</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center pl-1">
                        <View className="w-6 h-6 rounded-full bg-[#333] z-10" />
                        <View className="ml-4">
                            <Text className="text-[#666] font-bold">Delivered</Text>
                            <Text className="text-[#666] text-sm">Expected at 2:25 PM</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
