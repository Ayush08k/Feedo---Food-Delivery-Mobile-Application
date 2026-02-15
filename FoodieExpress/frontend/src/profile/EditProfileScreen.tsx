import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ProfileData } from '../utils/profileUtils';
import { useEffect } from 'react';
import { useUser } from '../utils/UserContext';
import { useAlert } from '../utils/AlertContext';
import { usePermissions, PermissionType } from '../hooks/usePermissions';
import PermissionModal from '../components/PermissionModal';

export default function EditProfileScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { role = 'user' } = route.params || {};
    const { profile, updateProfile, refreshProfile } = useUser();
    const { showAlert } = useAlert();

    // Common fields
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [name, setName] = useState('John Doe');
    const [phone, setPhone] = useState('+91 9876543210');
    const [email, setEmail] = useState('john.doe@example.com');

    // Customer fields
    const [address, setAddress] = useState('');

    // Driver fields
    const [vehicleType, setVehicleType] = useState('bike');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [driverAddress, setDriverAddress] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [isAvailable, setIsAvailable] = useState(true);

    // Restaurant fields
    const [restaurantName, setRestaurantName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [restaurantPhone, setRestaurantPhone] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [fssaiLicense, setFssaiLicense] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [openingTime, setOpeningTime] = useState('09:00 AM');
    const [closingTime, setClosingTime] = useState('11:00 PM');
    const [isOpen, setIsOpen] = useState(true);

    // Focus states
    const [focused, setFocused] = useState<string>('');

    // Permission modal state
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [requestingPermission, setRequestingPermission] = useState<PermissionType | null>(null);
    const { checkPermissionStatus, requestPermission, getPermissionConfig } = usePermissions();

    const pickImage = async () => {
        // Check current permission status
        const status = await checkPermissionStatus('gallery');

        if (status === 'denied') {
            // Show permission modal to re-request
            setRequestingPermission('gallery');
            setShowPermissionModal(true);
            return;
        }

        if (status === 'undetermined') {
            // Need to request permission first
            setRequestingPermission('gallery');
            setShowPermissionModal(true);
            return;
        }

        // Permission already granted, proceed with image picker
        await launchImagePicker();
    };

    const launchImagePicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handlePermissionAllow = async () => {
        if (!requestingPermission) return;

        const granted = await requestPermission(requestingPermission);
        setShowPermissionModal(false);

        if (granted && requestingPermission === 'gallery') {
            // Permission granted, launch image picker
            await launchImagePicker();
        } else {
            // Permission denied again
            showAlert(
                'Permission Required',
                'Gallery permission is needed to upload photos. You can enable it from your device settings.',
                [{ text: 'OK' }]
            );
        }

        setRequestingPermission(null);
    };

    const handlePermissionDeny = () => {
        setShowPermissionModal(false);

        if (requestingPermission === 'gallery') {
            showAlert(
                'Permission Required',
                'Gallery permission is needed to upload photos. Tap the photo button again to grant permission.',
                [{ text: 'OK' }]
            );
        }

        setRequestingPermission(null);
    };

    useEffect(() => {
        // Load saved profile data on mount
        if (profile) {
            setProfileImage(profile.profileImage);
            setName(profile.name);
            setPhone(profile.phone);
            setEmail(profile.email);

            if (profile.role === 'user') {
                setAddress(profile.address || '');
            } else if (profile.role === 'driver') {
                setVehicleType(profile.vehicleType || 'bike');
                setVehicleNumber(profile.vehicleNumber || '');
                setLicenseNumber(profile.licenseNumber || '');
                setDriverAddress(profile.driverAddress || '');
                setBankAccountNumber(profile.bankAccountNumber || '');
                setIfscCode(profile.ifscCode || '');
                setIsAvailable(profile.isAvailable ?? true);
            } else if (profile.role === 'restaurant') {
                setRestaurantName(profile.restaurantName || '');
                setOwnerName(profile.ownerName || '');
                setRestaurantPhone(profile.restaurantPhone || '');
                setCuisineType(profile.cuisineType || '');
                setRestaurantAddress(profile.restaurantAddress || '');
                setFssaiLicense(profile.fssaiLicense || '');
                setGstNumber(profile.gstNumber || '');
                setOpeningTime(profile.openingTime || '09:00 AM');
                setClosingTime(profile.closingTime || '11:00 PM');
                setIsOpen(profile.isOpen ?? true);
            }
        }
    }, [profile]);

    const handleSave = async () => {
        try {
            const profileData: ProfileData = {
                role,
                profileImage,
                name,
                phone,
                email,
            };

            // Add role-specific fields
            if (role === 'user') {
                profileData.address = address;
            } else if (role === 'driver') {
                profileData.vehicleType = vehicleType;
                profileData.vehicleNumber = vehicleNumber;
                profileData.licenseNumber = licenseNumber;
                profileData.driverAddress = driverAddress;
                profileData.bankAccountNumber = bankAccountNumber;
                profileData.ifscCode = ifscCode;
                profileData.isAvailable = isAvailable;
            } else if (role === 'restaurant') {
                profileData.restaurantName = restaurantName;
                profileData.ownerName = ownerName;
                profileData.restaurantPhone = restaurantPhone;
                profileData.cuisineType = cuisineType;
                profileData.restaurantAddress = restaurantAddress;
                profileData.fssaiLicense = fssaiLicense;
                profileData.gstNumber = gstNumber;
                profileData.openingTime = openingTime;
                profileData.closingTime = closingTime;
                profileData.isOpen = isOpen;
            }

            await updateProfile(profileData);

            showAlert('Success', 'Profile updated successfully!', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            showAlert('Error', 'Failed to save profile. Please try again.');
        }
    };

    const renderInput = (label: string, value: string, onChange: (val: string) => void, options: any = {}) => (
        <View className="mb-4">
            <Text className="text-white mb-2 ml-1">{label}</Text>
            <TextInput
                className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                style={{
                    borderWidth: 2,
                    borderColor: focused === label ? '#1DB954' : '#333',
                    ...(options.multiline && { minHeight: 80, textAlignVertical: 'top' })
                }}
                placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
                placeholderTextColor="#666"
                value={value}
                onChangeText={onChange}
                onFocus={() => setFocused(label)}
                onBlur={() => setFocused('')}
                editable={options.editable !== false}
                keyboardType={options.keyboardType || 'default'}
                multiline={options.multiline}
                numberOfLines={options.numberOfLines}
                maxLength={options.maxLength}
                autoCapitalize={options.autoCapitalize || 'sentences'}
            />
            {options.helperText && (
                <Text className="text-[#666] text-xs ml-1 mt-1">{options.helperText}</Text>
            )}
        </View>
    );

    const renderProfilePicture = () => (
        <View className="items-center mb-6">
            <TouchableOpacity onPress={pickImage} className="relative">
                <View className="w-32 h-32 rounded-full bg-[#1E1E1E] border-4 border-[#1DB954] items-center justify-center overflow-hidden">
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} className="w-full h-full" />
                    ) : (
                        <Text className="text-6xl">
                            {role === 'driver' ? '🏍️' : role === 'restaurant' ? '🍽️' : '👤'}
                        </Text>
                    )}
                </View>
                <View className="absolute bottom-0 right-0 bg-[#1DB954] w-10 h-10 rounded-full items-center justify-center border-4 border-[#121212]">
                    <Text className="text-xl">📷</Text>
                </View>
            </TouchableOpacity>
            <Text className="text-[#A0A0A0] mt-2">Tap to change photo</Text>
        </View>
    );

    const renderCustomerForm = () => (
        <>
            {renderInput('Name', name, setName)}
            {renderInput('Phone Number', phone, setPhone, { keyboardType: 'phone-pad' })}
            {renderInput('Email', email, setEmail, {
                editable: false,
                helperText: 'Email cannot be changed'
            })}
            {renderInput('Delivery Address', address, setAddress, {
                multiline: true,
                numberOfLines: 2,
                placeholder: 'Enter your complete delivery address'
            })}
        </>
    );

    const renderDriverForm = () => (
        <>
            {renderInput('Name', name, setName)}
            {renderInput('Phone Number', phone, setPhone, { keyboardType: 'phone-pad' })}
            {renderInput('Email', email, setEmail, {
                editable: false,
                helperText: 'Email cannot be changed'
            })}

            <View className="mb-4">
                <Text className="text-white mb-2 ml-1">Vehicle Type</Text>
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        className={`flex-1 p-4 rounded-xl border-2 ${vehicleType === 'bike' ? 'bg-[#1DB954] border-[#1DB954]' : 'bg-[#1E1E1E] border-[#333]'}`}
                        onPress={() => setVehicleType('bike')}
                    >
                        <Text className={`text-center font-bold ${vehicleType === 'bike' ? 'text-black' : 'text-white'}`}>🏍️ Bike</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 p-4 rounded-xl border-2 ${vehicleType === 'car' ? 'bg-[#1DB954] border-[#1DB954]' : 'bg-[#1E1E1E] border-[#333]'}`}
                        onPress={() => setVehicleType('car')}
                    >
                        <Text className={`text-center font-bold ${vehicleType === 'car' ? 'text-black' : 'text-white'}`}>🚗 Car</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {renderInput('Vehicle Number', vehicleNumber, setVehicleNumber, {
                placeholder: 'e.g., DL 01 AB 1234',
                autoCapitalize: 'characters'
            })}
            {renderInput('License Number', licenseNumber, setLicenseNumber, { autoCapitalize: 'characters' })}
            {renderInput('Address', driverAddress, setDriverAddress, { multiline: true, numberOfLines: 2 })}
            {renderInput('Bank Account Number', bankAccountNumber, setBankAccountNumber, { keyboardType: 'number-pad' })}
            {renderInput('IFSC Code', ifscCode, setIfscCode, { autoCapitalize: 'characters' })}

            <View className="mb-4 flex-row items-center justify-between bg-[#1E1E1E] p-4 rounded-xl border-2 border-[#333]">
                <Text className="text-white text-lg">Available for Deliveries</Text>
                <TouchableOpacity
                    className={`w-16 h-8 rounded-full ${isAvailable ? 'bg-[#1DB954]' : 'bg-[#666]'} justify-center`}
                    onPress={() => setIsAvailable(!isAvailable)}
                >
                    <View className={`w-6 h-6 bg-white rounded-full ${isAvailable ? 'self-end mr-1' : 'self-start ml-1'}`} />
                </TouchableOpacity>
            </View>
        </>
    );

    const renderRestaurantForm = () => (
        <>
            {renderInput('Restaurant Name', restaurantName, setRestaurantName)}
            {renderInput('Owner Name', ownerName, setOwnerName)}
            {renderInput('Restaurant Phone', restaurantPhone, setRestaurantPhone, { keyboardType: 'phone-pad' })}
            {renderInput('Email', email, setEmail, {
                editable: false,
                helperText: 'Email cannot be changed'
            })}

            <View className="mb-4">
                <Text className="text-white mb-2 ml-1">Cuisine Type</Text>
                <View className="flex-row flex-wrap gap-2">
                    {['Indian', 'Chinese', 'Italian', 'Fast Food', 'Desserts', 'Beverages'].map((cuisine) => (
                        <TouchableOpacity
                            key={cuisine}
                            className={`px-4 py-3 rounded-xl border-2 ${cuisineType === cuisine ? 'bg-[#1DB954] border-[#1DB954]' : 'bg-[#1E1E1E] border-[#333]'}`}
                            onPress={() => setCuisineType(cuisine)}
                        >
                            <Text className={`font-semibold ${cuisineType === cuisine ? 'text-black' : 'text-white'}`}>
                                {cuisine}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {renderInput('Restaurant Address', restaurantAddress, setRestaurantAddress, { multiline: true, numberOfLines: 2 })}
            {renderInput('FSSAI License', fssaiLicense, setFssaiLicense, {
                keyboardType: 'number-pad',
                maxLength: 14,
                placeholder: '14-digit FSSAI license number'
            })}
            {renderInput('GST Number', gstNumber, setGstNumber, {
                autoCapitalize: 'characters',
                maxLength: 15
            })}

            <View className="mb-4">
                <Text className="text-white mb-2 ml-1">Operating Hours</Text>
                <View className="flex-row gap-2">
                    {renderInput('Opening', openingTime, setOpeningTime, {
                        placeholder: '09:00 AM'
                    })}
                    {renderInput('Closing', closingTime, setClosingTime, {
                        placeholder: '11:00 PM'
                    })}
                </View>
            </View>

            {renderInput('Bank Account Number', bankAccountNumber, setBankAccountNumber, { keyboardType: 'number-pad' })}
            {renderInput('IFSC Code', ifscCode, setIfscCode, { autoCapitalize: 'characters' })}

            <View className="mb-4 flex-row items-center justify-between bg-[#1E1E1E] p-4 rounded-xl border-2 border-[#333]">
                <Text className="text-white text-lg">Restaurant Status</Text>
                <TouchableOpacity
                    className={`w-16 h-8 rounded-full ${isOpen ? 'bg-[#1DB954]' : 'bg-[#666]'} justify-center`}
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <View className={`w-6 h-6 bg-white rounded-full ${isOpen ? 'self-end mr-1' : 'self-start ml-1'}`} />
                </TouchableOpacity>
            </View>
            <Text className="text-[#A0A0A0] text-right mb-4">{isOpen ? 'Open' : 'Closed'}</Text>
        </>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-2 rounded-full bg-[#1E1E1E]"
                    >
                        <Text className="text-white">←</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-2xl font-bold">Edit Profile</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 24 }}
                keyboardShouldPersistTaps="handled"
            >
                {renderProfilePicture()}

                {role === 'user' && renderCustomerForm()}
                {role === 'driver' && renderDriverForm()}
                {role === 'restaurant' && renderRestaurantForm()}

                {/* Save Button */}
                <TouchableOpacity
                    className="w-full bg-[#1DB954] p-4 rounded-xl items-center mt-6 mb-10 shadow-lg shadow-green-900/50"
                    onPress={handleSave}
                >
                    <Text className="text-black font-bold text-lg">Save Changes</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Permission Modal */}
            {requestingPermission && (
                <PermissionModal
                    visible={showPermissionModal}
                    title={getPermissionConfig(requestingPermission).title}
                    description={getPermissionConfig(requestingPermission).description}
                    icon={getPermissionConfig(requestingPermission).icon}
                    onAllow={handlePermissionAllow}
                    onDeny={handlePermissionDeny}
                />
            )}
        </SafeAreaView>
    );
}
