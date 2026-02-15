import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';
import * as Location from 'expo-location';

type AddressType = 'home' | 'work' | 'other';

interface AddressForm {
    type: AddressType;
    houseName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark: string;
}

type ViewMode = 'selection' | 'gps' | 'manual';

export default function AddAddressScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { showAlert } = useAlert();

    const [viewMode, setViewMode] = useState<ViewMode>('selection');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressForm>({
        type: 'home',
        houseName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: ''
    });
    const [errors, setErrors] = useState<Partial<AddressForm>>({});

    const requestLocationPermission = async () => {
        setIsLoadingLocation(true);
        try {
            // Check current permission status
            const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

            // If already permanently denied, show settings instructions
            if (existingStatus === 'denied') {
                setIsLoadingLocation(false);
                showLocationSettingsInstructions();
                return;
            }

            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setIsLoadingLocation(false);
                showLocationSettingsInstructions();
                return;
            }

            // Get current location
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced
            });

            // Reverse geocode to get address
            const addresses = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (addresses.length > 0) {
                const address = addresses[0];
                setAddressForm({
                    ...addressForm,
                    street: `${address.name || ''} ${address.street || ''}`.trim(),
                    city: address.city || '',
                    state: address.region || '',
                    zipCode: address.postalCode || ''
                });
                setViewMode('manual'); // Show form with pre-filled data
            }
        } catch (error) {
            console.error('Location error:', error);
            showAlert(
                'Location Error',
                'Unable to retrieve your location. Please enter your address manually.',
                [{ text: 'OK', onPress: () => setViewMode('manual') }]
            );
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const showLocationSettingsInstructions = () => {
        const instructions = `To enable location access:

📱 **Android:**
1. Open your device Settings
2. Go to Apps → Feedo
3. Tap Permissions
4. Find Location
5. Select "Allow only while using the app"

🍎 **iOS:**
1. Open Settings app
2. Scroll down to Feedo
3. Tap on Location
4. Select "While Using the App"

After enabling, return here and tap the location button again.`;

        showAlert(
            '📍 Location Permission Required',
            instructions,
            [
                { text: 'Enter Manually Instead', onPress: () => setViewMode('manual') },
                { text: 'Got It', style: 'cancel' }
            ]
        );
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<AddressForm> = {};

        if (!addressForm.houseName.trim()) newErrors.houseName = 'House/Flat name is required';
        if (!addressForm.street.trim()) newErrors.street = 'Street address is required';
        if (!addressForm.city.trim()) newErrors.city = 'City is required';
        if (!addressForm.state.trim()) newErrors.state = 'State is required';
        if (!addressForm.zipCode.trim()) newErrors.zipCode = 'Pincode is required';
        else if (!/^\d{6}$/.test(addressForm.zipCode.trim())) newErrors.zipCode = 'Enter valid 6-digit pincode';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            showAlert('Validation Error', 'Please fill in all required fields correctly.');
            return;
        }

        // Create address object with unique ID
        const newAddress = {
            id: Date.now().toString(),
            type: addressForm.type,
            name: addressForm.type.charAt(0).toUpperCase() + addressForm.type.slice(1),
            street: `${addressForm.houseName}, ${addressForm.street}`,
            city: addressForm.city,
            state: addressForm.state,
            zipCode: addressForm.zipCode,
            landmark: addressForm.landmark,
            isDefault: false
        };

        // If there's a callback from the previous screen, call it
        if (route.params?.onAddAddress) {
            route.params.onAddAddress(newAddress);
        }

        showAlert('Success', 'Address added successfully!', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    const updateField = (field: keyof AddressForm, value: string) => {
        setAddressForm({ ...addressForm, [field]: value });
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors({ ...errors, [field]: undefined });
        }
    };

    const renderSelectionView = () => (
        <View className="flex-1 px-6 justify-center">
            <Text className="text-white text-2xl font-bold text-center mb-4">
                How would you like to add your address?
            </Text>
            <Text className="text-[#A0A0A0] text-center mb-8">
                Choose your preferred method
            </Text>

            {/* Use Current Location */}
            <TouchableOpacity
                className="bg-[#1DB954] p-6 rounded-2xl mb-4"
                onPress={requestLocationPermission}
                disabled={isLoadingLocation}
            >
                <View className="flex-row items-center justify-center">
                    <Text className="text-4xl mr-3">📍</Text>
                    <View className="flex-1">
                        <Text className="text-black font-bold text-lg">Use My Current Location</Text>
                        <Text className="text-black/70 text-sm mt-1">
                            We'll fetch your address automatically
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Enter Manually */}
            <TouchableOpacity
                className="bg-[#1E1E1E] p-6 rounded-2xl border-2 border-[#333]"
                onPress={() => setViewMode('manual')}
                disabled={isLoadingLocation}
            >
                <View className="flex-row items-center justify-center">
                    <Text className="text-4xl mr-3">✍️</Text>
                    <View className="flex-1">
                        <Text className="text-white font-bold text-lg">Enter Manually</Text>
                        <Text className="text-[#A0A0A0] text-sm mt-1">
                            Fill in your address details
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {isLoadingLocation && (
                <View className="mt-6 items-center">
                    <ActivityIndicator size="large" color="#1DB954" />
                    <Text className="text-[#A0A0A0] mt-2">Getting your location...</Text>
                </View>
            )}
        </View>
    );

    const renderManualForm = () => (
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
            {/* Address Type Selection */}
            <Text className="text-white font-bold text-lg mb-3">Address Type *</Text>
            <View className="flex-row mb-6">
                {(['home', 'work', 'other'] as AddressType[]).map((type) => (
                    <TouchableOpacity
                        key={type}
                        className={`flex-1 py-3 rounded-xl mr-2 border-2 ${addressForm.type === type
                            ? 'bg-[#1DB954] border-[#1DB954]'
                            : 'bg-[#1E1E1E] border-[#333]'
                            }`}
                        onPress={() => updateField('type', type)}
                    >
                        <Text
                            className={`text-center font-bold ${addressForm.type === type ? 'text-black' : 'text-white'
                                }`}
                        >
                            {type === 'home' ? '🏠 Home' : type === 'work' ? '💼 Work' : '📍 Other'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* House/Flat Name */}
            <Text className="text-white font-bold text-base mb-2">House/Flat Name *</Text>
            <TextInput
                className={`bg-[#1E1E1E] text-white p-4 rounded-xl mb-1 border-2 ${errors.houseName ? 'border-red-500' : 'border-[#333]'
                    }`}
                placeholder="e.g., Flat 4B, Building A"
                placeholderTextColor="#666"
                value={addressForm.houseName}
                onChangeText={(value) => updateField('houseName', value)}
            />
            {errors.houseName && <Text className="text-red-500 text-xs mb-3 ml-2">{errors.houseName}</Text>}
            {!errors.houseName && <View className="mb-3" />}

            {/* Street Address */}
            <Text className="text-white font-bold text-base mb-2">Street Address *</Text>
            <TextInput
                className={`bg-[#1E1E1E] text-white p-4 rounded-xl mb-1 border-2 ${errors.street ? 'border-red-500' : 'border-[#333]'
                    }`}
                placeholder="e.g., 123 Main Street"
                placeholderTextColor="#666"
                value={addressForm.street}
                onChangeText={(value) => updateField('street', value)}
            />
            {errors.street && <Text className="text-red-500 text-xs mb-3 ml-2">{errors.street}</Text>}
            {!errors.street && <View className="mb-3" />}

            {/* City */}
            <Text className="text-white font-bold text-base mb-2">City *</Text>
            <TextInput
                className={`bg-[#1E1E1E] text-white p-4 rounded-xl mb-1 border-2 ${errors.city ? 'border-red-500' : 'border-[#333]'
                    }`}
                placeholder="e.g., Mumbai"
                placeholderTextColor="#666"
                value={addressForm.city}
                onChangeText={(value) => updateField('city', value)}
            />
            {errors.city && <Text className="text-red-500 text-xs mb-3 ml-2">{errors.city}</Text>}
            {!errors.city && <View className="mb-3" />}

            {/* State and Pincode Row */}
            <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                    <Text className="text-white font-bold text-base mb-2">State *</Text>
                    <TextInput
                        className={`bg-[#1E1E1E] text-white p-4 rounded-xl mb-1 border-2 ${errors.state ? 'border-red-500' : 'border-[#333]'
                            }`}
                        placeholder="e.g., Maharashtra"
                        placeholderTextColor="#666"
                        value={addressForm.state}
                        onChangeText={(value) => updateField('state', value)}
                    />
                    {errors.state && <Text className="text-red-500 text-xs ml-2">{errors.state}</Text>}
                </View>
                <View className="flex-1 ml-2">
                    <Text className="text-white font-bold text-base mb-2">Pincode *</Text>
                    <TextInput
                        className={`bg-[#1E1E1E] text-white p-4 rounded-xl mb-1 border-2 ${errors.zipCode ? 'border-red-500' : 'border-[#333]'
                            }`}
                        placeholder="e.g., 400001"
                        placeholderTextColor="#666"
                        value={addressForm.zipCode}
                        onChangeText={(value) => updateField('zipCode', value)}
                        keyboardType="numeric"
                        maxLength={6}
                    />
                    {errors.zipCode && <Text className="text-red-500 text-xs ml-2">{errors.zipCode}</Text>}
                </View>
            </View>

            {/* Landmark (Optional) */}
            <Text className="text-white font-bold text-base mb-2">Landmark (Optional)</Text>
            <TextInput
                className="bg-[#1E1E1E] text-white p-4 rounded-xl mb-4 border-2 border-[#333]"
                placeholder="e.g., Near Central Park"
                placeholderTextColor="#666"
                value={addressForm.landmark}
                onChangeText={(value) => updateField('landmark', value)}
            />

            {/* Submit Button */}
            <TouchableOpacity
                className="bg-[#1DB954] p-4 rounded-xl mb-4"
                onPress={handleSubmit}
            >
                <Text className="text-black text-center font-bold text-lg">Save Address</Text>
            </TouchableOpacity>

            {/* Back to Selection */}
            {viewMode === 'manual' && (
                <TouchableOpacity
                    className="bg-[#1E1E1E] p-4 rounded-xl mb-6 border-2 border-[#333]"
                    onPress={() => setViewMode('selection')}
                >
                    <Text className="text-white text-center font-bold text-base">
                        ← Back to Options
                    </Text>
                </TouchableOpacity>
            )}

            <View className="h-20" />
        </ScrollView>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 border-b border-[#333] flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                        <Text className="text-[#1DB954] text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Add New Address</Text>
                </View>
            </View>

            {viewMode === 'selection' && renderSelectionView()}
            {viewMode === 'manual' && renderManualForm()}
        </SafeAreaView>
    );
}
