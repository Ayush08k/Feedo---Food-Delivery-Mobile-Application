import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import UniversalMap from '../components/UniversalMap';
import { useAlert } from '../utils/AlertContext';

export default function MapPickerScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { showAlert } = useAlert();

    const [coords, setCoords] = useState({ lat: 17.3850, lng: 78.4867 });
    const [address, setAddress] = useState('Fetching address...');
    const [isResolving, setIsResolving] = useState(false);
    const [fullAddress, setFullAddress] = useState<any>(null);
    const timerRef = useRef<any>(null);

    // Initial location
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({});
                setCoords({ lat: location.coords.latitude, lng: location.coords.longitude });
                resolveAddress(location.coords.latitude, location.coords.longitude);
            } else {
                resolveAddress(17.3850, 78.4867);
            }
        })();
    }, []);

    const resolveAddress = async (lat: number, lng: number) => {
        setIsResolving(true);
        try {
            const results = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
            if (results.length > 0) {
                const addr = results[0];
                const display = `${addr.name || ''} ${addr.street || ''}, ${addr.city || ''}`.trim();
                setAddress(display || 'Unknown location');
                setFullAddress(addr);
            }
        } catch (e) {
            setAddress('Error fetching address');
        } finally {
            setIsResolving(false);
        }
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setCoords({ lat, lng });
        // Debounce reverse geocoding
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            resolveAddress(lat, lng);
        }, 1000);
    };

    const handleConfirm = () => {
        if (route.params?.onLocationSelected && fullAddress) {
            route.params.onLocationSelected({
                coords,
                address: fullAddress
            });
            navigation.goBack();
        } else {
            showAlert('Wait', 'Please wait until we resolve the address.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="px-4 py-4 flex-row items-center justify-between border-b border-[#333]">
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="#1DB954" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Pick Location</Text>
                <View style={{ width: 28 }} />
            </View>

            <View className="flex-1 relative">
                <UniversalMap 
                    lat={coords.lat} 
                    lng={coords.lng} 
                    isPicker={true} 
                    onLocationChange={handleLocationChange} 
                />
            </View>

            <View className="bg-[#1E1E1E] p-6 rounded-t-3xl shadow-lg">
                <View className="flex-row items-center mb-4">
                    <Ionicons name="location" size={24} color="#1DB954" />
                    <View className="ml-3 flex-1">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Select Delivery Location</Text>
                        <Text className="text-white text-lg font-semibold" numberOfLines={2}>
                            {isResolving ? 'Locating...' : address}
                        </Text>
                    </View>
                    {isResolving && <ActivityIndicator size="small" color="#1DB954" />}
                </View>

                <TouchableOpacity 
                    className={`p-4 rounded-xl items-center ${isResolving ? 'bg-[#333]' : 'bg-[#1DB954]'}`}
                    onPress={handleConfirm}
                    disabled={isResolving}
                >
                    <Text className="text-black font-bold text-lg">Confirm Location</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
