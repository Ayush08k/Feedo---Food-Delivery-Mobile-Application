import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';
import * as Location from 'expo-location';

type AddressType = 'home' | 'work' | 'other';

interface AddressForm {
    label: string;         // Custom name e.g. "Mom's House"
    type: AddressType;
    houseName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark: string;
    lat: number | null;
    lng: number | null;
}

type ViewMode = 'selection' | 'manual';

export default function AddAddressScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { showAlert } = useAlert();

    const [viewMode, setViewMode] = useState<ViewMode>('selection');
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [addressForm, setAddressForm] = useState<AddressForm>({
        label: '',
        type: 'home',
        houseName: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        landmark: '',
        lat: null,
        lng: null,
    });
    const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});

    const updateField = (field: keyof AddressForm, value: any) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    // ── GPS auto-fill ──────────────────────────────────────────
    const requestLocationPermission = async () => {
        setIsLoadingLocation(true);
        try {
            const { status: ex } = await Location.getForegroundPermissionsAsync();
            if (ex === 'denied') { setIsLoadingLocation(false); showLocationDenied(); return; }
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') { setIsLoadingLocation(false); showLocationDenied(); return; }

            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const { latitude, longitude } = loc.coords;
            const results = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (results.length > 0) {
                const a = results[0];
                setAddressForm(prev => ({
                    ...prev,
                    street: `${a.name || ''} ${a.street || ''}`.trim(),
                    city: a.city || '',
                    state: a.region || '',
                    zipCode: a.postalCode || '',
                    lat: latitude,
                    lng: longitude,
                }));
                setViewMode('manual');
            }
        } catch {
            showAlert('Location Error', 'Unable to get your location. Please enter manually.', [
                { text: 'OK', onPress: () => setViewMode('manual') }
            ]);
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const showLocationDenied = () => {
        showAlert('📍 Location Permission Required',
            'Enable location in your device Settings to use this feature.',
            [
                { text: 'Enter Manually', onPress: () => setViewMode('manual') },
                { text: 'OK', style: 'cancel' }
            ]
        );
    };

    // ── Map picker callback ───────────────────────────────────
    const openMapPicker = () => {
        navigation.navigate('MapPicker', {
            onLocationSelected: (data: any) => {
                const { coords, nominatim } = data;
                // nominatim has: street, city, state, postalCode, displayAddress
                setAddressForm(prev => ({
                    ...prev,
                    street: nominatim?.street || nominatim?.displayAddress || '',
                    city: nominatim?.city || '',
                    state: nominatim?.state || '',
                    zipCode: nominatim?.postalCode || '',
                    lat: coords.lat,
                    lng: coords.lng,
                }));
                setViewMode('manual');
            }
        });
    };

    // ── Validation ────────────────────────────────────────────
    const validateForm = (): boolean => {
        const e: Partial<Record<keyof AddressForm, string>> = {};
        if (!addressForm.label.trim()) e.label = 'Give this address a name (e.g. Home, Office)';
        if (!addressForm.street.trim()) e.street = 'Street address is required';
        if (!addressForm.city.trim()) e.city = 'City is required';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // ── Save ──────────────────────────────────────────────────
    const handleSubmit = () => {
        if (!validateForm()) return;

        const newAddress = {
            id: Date.now().toString(),
            type: addressForm.type,
            name: addressForm.label.trim() ||
                (addressForm.type === 'home' ? 'Home' : addressForm.type === 'work' ? 'Work' : 'Other'),
            street: `${addressForm.houseName ? addressForm.houseName + ', ' : ''}${addressForm.street}`.trim(),
            city: addressForm.city,
            state: addressForm.state,
            zipCode: addressForm.zipCode,
            landmark: addressForm.landmark,
            lat: addressForm.lat,
            lng: addressForm.lng,
            isDefault: false,
        };

        if (route.params?.onAddAddress) route.params.onAddAddress(newAddress);
        showAlert('✅ Address Saved!', `"${newAddress.name}" has been added to your addresses.`, [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    // ── Selection Screen ──────────────────────────────────────
    const renderSelectionView = () => (
        <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 }}>
                How to add your address?
            </Text>
            <Text style={{ color: '#A0A0A0', textAlign: 'center', marginBottom: 32 }}>
                Choose your preferred method
            </Text>

            {/* GPS */}
            <TouchableOpacity
                style={{ backgroundColor: '#1DB954', padding: 20, borderRadius: 20, marginBottom: 14 }}
                onPress={requestLocationPermission} disabled={isLoadingLocation}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, marginRight: 14 }}>📍</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 16 }}>Use My Current Location</Text>
                        <Text style={{ color: 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 2 }}>Auto-fill address from GPS</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Map Picker */}
            <TouchableOpacity
                style={{ backgroundColor: '#1E1E1E', padding: 20, borderRadius: 20, marginBottom: 14, borderWidth: 2, borderColor: '#333' }}
                onPress={openMapPicker} disabled={isLoadingLocation}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, marginRight: 14 }}>🗺️</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Pick from Map</Text>
                        <Text style={{ color: '#A0A0A0', fontSize: 13, marginTop: 2 }}>Pin your exact location on the OSM map</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Manual */}
            <TouchableOpacity
                style={{ backgroundColor: '#1E1E1E', padding: 20, borderRadius: 20, borderWidth: 2, borderColor: '#333' }}
                onPress={() => setViewMode('manual')} disabled={isLoadingLocation}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, marginRight: 14 }}>✍️</Text>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Enter Manually</Text>
                        <Text style={{ color: '#A0A0A0', fontSize: 13, marginTop: 2 }}>Fill in your address details</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {isLoadingLocation && (
                <View style={{ marginTop: 24, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#1DB954" />
                    <Text style={{ color: '#A0A0A0', marginTop: 8 }}>Getting your location…</Text>
                </View>
            )}
        </View>
    );

    // ── Manual Form ───────────────────────────────────────────
    const renderManualForm = () => (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }} showsVerticalScrollIndicator={false}>

            {/* 📛 Address Label / Name */}
            <View style={{
                backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16,
                borderWidth: 2, borderColor: '#1DB954', marginBottom: 20
            }}>
                <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase', marginBottom: 8 }}>
                    📛 Save This Address As
                </Text>
                <TextInput
                    style={{
                        color: 'white', fontSize: 18, fontWeight: 'bold',
                        borderBottomWidth: 1, borderBottomColor: errors.label ? '#ef4444' : '#333',
                        paddingVertical: 6
                    }}
                    placeholder="e.g. Home, Office, Mom's House…"
                    placeholderTextColor="#555"
                    value={addressForm.label}
                    onChangeText={v => updateField('label', v)}
                />
                {errors.label && (
                    <Text style={{ color: '#ef4444', fontSize: 12, marginTop: 6 }}>{errors.label}</Text>
                )}
            </View>

            {/* 📌 GPS Coordinates (if available) */}
            {addressForm.lat !== null && addressForm.lng !== null && (
                <View style={{
                    backgroundColor: '#0d2118', borderRadius: 12, padding: 12,
                    marginBottom: 20, flexDirection: 'row', alignItems: 'center',
                    borderWidth: 1, borderColor: '#1DB954'
                }}>
                    <Text style={{ fontSize: 20, marginRight: 10 }}>🌐</Text>
                    <View>
                        <Text style={{ color: '#1DB954', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase' }}>
                            GPS Coordinates
                        </Text>
                        <Text style={{ color: 'white', fontSize: 13, marginTop: 2 }}>
                            {addressForm.lat.toFixed(6)}, {addressForm.lng.toFixed(6)}
                        </Text>
                    </View>
                </View>
            )}

            {/* Address Type */}
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>Address Type</Text>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                {(['home', 'work', 'other'] as AddressType[]).map(type => (
                    <TouchableOpacity
                        key={type}
                        style={{
                            flex: 1, paddingVertical: 12, borderRadius: 12, marginRight: 8,
                            backgroundColor: addressForm.type === type ? '#1DB954' : '#1E1E1E',
                            borderWidth: 2, borderColor: addressForm.type === type ? '#1DB954' : '#333'
                        }}
                        onPress={() => updateField('type', type)}
                    >
                        <Text style={{
                            textAlign: 'center', fontWeight: 'bold',
                            color: addressForm.type === type ? 'black' : 'white'
                        }}>
                            {type === 'home' ? '🏠 Home' : type === 'work' ? '💼 Work' : '📍 Other'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* House / Flat */}
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>House / Flat (Optional)</Text>
            <TextInput
                style={{
                    backgroundColor: '#1E1E1E', color: 'white', padding: 14,
                    borderRadius: 12, marginBottom: 16, borderWidth: 2, borderColor: '#333'
                }}
                placeholder="e.g. Flat 4B, Building A"
                placeholderTextColor="#555"
                value={addressForm.houseName}
                onChangeText={v => updateField('houseName', v)}
            />

            {/* Street */}
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Street Address *</Text>
            <TextInput
                style={{
                    backgroundColor: '#1E1E1E', color: 'white', padding: 14,
                    borderRadius: 12, marginBottom: 4, borderWidth: 2,
                    borderColor: errors.street ? '#ef4444' : '#333'
                }}
                placeholder="e.g. 123 Main Street"
                placeholderTextColor="#555"
                value={addressForm.street}
                onChangeText={v => updateField('street', v)}
            />
            {errors.street && <Text style={{ color: '#ef4444', fontSize: 12, marginBottom: 12 }}>{errors.street}</Text>}
            {!errors.street && <View style={{ marginBottom: 16 }} />}

            {/* City */}
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>City *</Text>
            <TextInput
                style={{
                    backgroundColor: '#1E1E1E', color: 'white', padding: 14,
                    borderRadius: 12, marginBottom: 4, borderWidth: 2,
                    borderColor: errors.city ? '#ef4444' : '#333'
                }}
                placeholder="e.g. Hyderabad"
                placeholderTextColor="#555"
                value={addressForm.city}
                onChangeText={v => updateField('city', v)}
            />
            {errors.city && <Text style={{ color: '#ef4444', fontSize: 12, marginBottom: 12 }}>{errors.city}</Text>}
            {!errors.city && <View style={{ marginBottom: 16 }} />}

            {/* State + Pincode row */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>State</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#1E1E1E', color: 'white', padding: 14,
                            borderRadius: 12, borderWidth: 2, borderColor: '#333'
                        }}
                        placeholder="e.g. Telangana"
                        placeholderTextColor="#555"
                        value={addressForm.state}
                        onChangeText={v => updateField('state', v)}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Pincode</Text>
                    <TextInput
                        style={{
                            backgroundColor: '#1E1E1E', color: 'white', padding: 14,
                            borderRadius: 12, borderWidth: 2, borderColor: '#333'
                        }}
                        placeholder="e.g. 500001"
                        placeholderTextColor="#555"
                        value={addressForm.zipCode}
                        onChangeText={v => updateField('zipCode', v)}
                        keyboardType="numeric"
                        maxLength={6}
                    />
                </View>
            </View>

            {/* Landmark */}
            <Text style={{ color: 'white', fontWeight: 'bold', marginBottom: 8 }}>Landmark (Optional)</Text>
            <TextInput
                style={{
                    backgroundColor: '#1E1E1E', color: 'white', padding: 14,
                    borderRadius: 12, marginBottom: 24, borderWidth: 2, borderColor: '#333'
                }}
                placeholder="e.g. Near City Mall"
                placeholderTextColor="#555"
                value={addressForm.landmark}
                onChangeText={v => updateField('landmark', v)}
            />

            {/* Save Button */}
            <TouchableOpacity
                style={{ backgroundColor: '#1DB954', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12 }}
                onPress={handleSubmit}
            >
                <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 17 }}>💾 Save Address</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    backgroundColor: '#1E1E1E', padding: 14, borderRadius: 14,
                    alignItems: 'center', marginBottom: 40, borderWidth: 2, borderColor: '#333'
                }}
                onPress={() => setViewMode('selection')}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>← Back to Options</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={{
                paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
                borderBottomColor: '#333', flexDirection: 'row', alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 14 }}>
                    <Text style={{ color: '#1DB954', fontSize: 24 }}>←</Text>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Add New Address</Text>
            </View>

            {viewMode === 'selection' ? renderSelectionView() : renderManualForm()}
        </SafeAreaView>
    );
}
