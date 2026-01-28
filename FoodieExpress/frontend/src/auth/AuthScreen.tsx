import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Animated, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AuthScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { role = 'user' } = route.params || {};

    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Driver-specific fields
    const [vehicleType, setVehicleType] = useState('bike');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [address, setAddress] = useState('');

    // Restaurant-specific fields
    const [restaurantName, setRestaurantName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [fssaiLicense, setFssaiLicense] = useState('');
    const [gstNumber, setGstNumber] = useState('');
    const [restaurantPhone, setRestaurantPhone] = useState('');
    const [openingTime, setOpeningTime] = useState('');
    const [closingTime, setClosingTime] = useState('');

    const [nameFocused, setNameFocused] = useState(false);
    const [phoneFocused, setPhoneFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [vehicleNumberFocused, setVehicleNumberFocused] = useState(false);
    const [licenseFocused, setLicenseFocused] = useState(false);
    const [bankAccountFocused, setBankAccountFocused] = useState(false);
    const [ifscFocused, setIfscFocused] = useState(false);
    const [addressFocused, setAddressFocused] = useState(false);
    const [restaurantNameFocused, setRestaurantNameFocused] = useState(false);
    const [ownerNameFocused, setOwnerNameFocused] = useState(false);
    const [restaurantAddressFocused, setRestaurantAddressFocused] = useState(false);
    const [cuisineTypeFocused, setCuisineTypeFocused] = useState(false);
    const [fssaiFocused, setFssaiFocused] = useState(false);
    const [gstFocused, setGstFocused] = useState(false);
    const [restaurantPhoneFocused, setRestaurantPhoneFocused] = useState(false);
    const [openingTimeFocused, setOpeningTimeFocused] = useState(false);
    const [closingTimeFocused, setClosingTimeFocused] = useState(false);

    // Animation values
    const [nameOpacity] = useState(new Animated.Value(0));
    const [phoneOpacity] = useState(new Animated.Value(0));
    const [emailOpacity] = useState(new Animated.Value(1));
    const [passwordOpacity] = useState(new Animated.Value(1));
    const [nameTranslateY] = useState(new Animated.Value(-20));
    const [phoneTranslateY] = useState(new Animated.Value(-20));
    const [emailTranslateY] = useState(new Animated.Value(0));
    const [passwordTranslateY] = useState(new Animated.Value(0));

    useEffect(() => {
        if (!isLogin) {
            // Animate in when switching to register
            Animated.parallel([
                Animated.timing(nameOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(phoneOpacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(emailOpacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(passwordOpacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 450,
                    useNativeDriver: true,
                }),
                Animated.timing(nameTranslateY, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(phoneTranslateY, {
                    toValue: 0,
                    duration: 500,
                    delay: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(emailTranslateY, {
                    toValue: 0,
                    duration: 500,
                    delay: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(passwordTranslateY, {
                    toValue: 0,
                    duration: 500,
                    delay: 450,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Animate when switching to login
            Animated.parallel([
                Animated.timing(nameOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(phoneOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(emailOpacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(passwordOpacity, {
                    toValue: 1,
                    duration: 500,
                    delay: 350,
                    useNativeDriver: true,
                }),
                Animated.timing(nameTranslateY, {
                    toValue: -20,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(phoneTranslateY, {
                    toValue: -20,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(emailTranslateY, {
                    toValue: 0,
                    duration: 500,
                    delay: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(passwordTranslateY, {
                    toValue: 0,
                    duration: 500,
                    delay: 350,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isLogin]);

    const handleAuth = () => {
        if (role === 'driver') {
            navigation.replace('DriverApp');
        } else if (role === 'restaurant') {
            navigation.replace('RestaurantApp');
        } else {
            navigation.replace('Main');
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <ImageBackground
                source={require('../../assets/bg-image.jpg')}
                style={StyleSheet.absoluteFillObject}
                resizeMode="cover"
            />
            <View className="flex-1 bg-black/67">
                <SafeAreaView className="flex-1">
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        className="flex-1"
                        keyboardVerticalOffset={0}
                    >
                        <ScrollView
                            className="flex-1 px-6"
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Glassmorphism Blur Container */}
                            <View className="bg-black/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/30">
                                <View className="items-center mb-8 w-full">
                                    <Image
                                        source={require('../../assets/logo.png')}
                                        style={{ width: '50%', height: 120 }}
                                        resizeMode="contain"
                                        className="mb-0"
                                    />
                                    <Text className="text-[#A0A0A0] text-xl uppercase tracking-widest">Midnight Craving</Text>
                                </View>

                                <View className="space-y-4">
                                    {!isLogin && (
                                        <Animated.View
                                            style={{
                                                opacity: nameOpacity,
                                                transform: [{ translateY: nameTranslateY }],
                                            }}
                                        >
                                            <Text className="text-white mb-2 ml-1">Name</Text>
                                            <TextInput
                                                className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                style={{
                                                    borderWidth: 2,
                                                    borderColor: nameFocused ? '#1DB954' : '#333'
                                                }}
                                                placeholder="Enter your full name"
                                                placeholderTextColor="#666"
                                                value={name}
                                                onChangeText={setName}
                                                onFocus={() => setNameFocused(true)}
                                                onBlur={() => setNameFocused(false)}
                                            />
                                        </Animated.View>
                                    )}

                                    {!isLogin && (
                                        <Animated.View
                                            style={{
                                                opacity: phoneOpacity,
                                                transform: [{ translateY: phoneTranslateY }],
                                            }}
                                        >
                                            <Text className="text-white mb-2 ml-1">Phone Number</Text>
                                            <TextInput
                                                className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                style={{
                                                    borderWidth: 2,
                                                    borderColor: phoneFocused ? '#1DB954' : '#333'
                                                }}
                                                placeholder="Enter your phone number"
                                                placeholderTextColor="#666"
                                                keyboardType="phone-pad"
                                                value={phone}
                                                onChangeText={setPhone}
                                                onFocus={() => setPhoneFocused(true)}
                                                onBlur={() => setPhoneFocused(false)}
                                            />
                                        </Animated.View>
                                    )}

                                    <Animated.View
                                        style={{
                                            opacity: emailOpacity,
                                            transform: [{ translateY: emailTranslateY }],
                                        }}
                                    >
                                        <Text className="text-white mb-2 ml-1">Email</Text>
                                        <TextInput
                                            className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                            style={{
                                                borderWidth: 2,
                                                borderColor: emailFocused ? '#1DB954' : '#333'
                                            }}
                                            placeholder="Enter your email"
                                            placeholderTextColor="#666"
                                            value={email}
                                            onChangeText={setEmail}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                        />
                                    </Animated.View>

                                    <Animated.View
                                        style={{
                                            opacity: passwordOpacity,
                                            transform: [{ translateY: passwordTranslateY }],
                                        }}
                                    >
                                        <Text className="text-white mb-2 ml-1">Password</Text>
                                        <TextInput
                                            className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                            style={{
                                                borderWidth: 2,
                                                borderColor: passwordFocused ? '#1DB954' : '#333'
                                            }}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#666"
                                            secureTextEntry
                                            value={password}
                                            onChangeText={setPassword}
                                            onFocus={() => setPasswordFocused(true)}
                                            onBlur={() => setPasswordFocused(false)}
                                        />
                                    </Animated.View>

                                    {/* Driver-specific fields */}
                                    {!isLogin && role === 'driver' && (
                                        <>
                                            <View className="mt-4">
                                                <Text className="text-white mb-2 ml-1">Vehicle Type</Text>
                                                <View className="flex-row space-x-2">
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

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Vehicle Number</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: vehicleNumberFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="e.g., DL 01 AB 1234"
                                                    placeholderTextColor="#666"
                                                    value={vehicleNumber}
                                                    onChangeText={setVehicleNumber}
                                                    onFocus={() => setVehicleNumberFocused(true)}
                                                    onBlur={() => setVehicleNumberFocused(false)}
                                                    autoCapitalize="characters"
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Driving License Number</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: licenseFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter your license number"
                                                    placeholderTextColor="#666"
                                                    value={licenseNumber}
                                                    onChangeText={setLicenseNumber}
                                                    onFocus={() => setLicenseFocused(true)}
                                                    onBlur={() => setLicenseFocused(false)}
                                                    autoCapitalize="characters"
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Address</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: addressFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter your full address"
                                                    placeholderTextColor="#666"
                                                    value={address}
                                                    onChangeText={setAddress}
                                                    onFocus={() => setAddressFocused(true)}
                                                    onBlur={() => setAddressFocused(false)}
                                                    multiline
                                                    numberOfLines={2}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Bank Account Number</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: bankAccountFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter your account number"
                                                    placeholderTextColor="#666"
                                                    keyboardType="number-pad"
                                                    value={bankAccountNumber}
                                                    onChangeText={setBankAccountNumber}
                                                    onFocus={() => setBankAccountFocused(true)}
                                                    onBlur={() => setBankAccountFocused(false)}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">IFSC Code</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: ifscFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter IFSC code"
                                                    placeholderTextColor="#666"
                                                    value={ifscCode}
                                                    onChangeText={setIfscCode}
                                                    onFocus={() => setIfscFocused(true)}
                                                    onBlur={() => setIfscFocused(false)}
                                                    autoCapitalize="characters"
                                                />
                                            </View>
                                        </>
                                    )}

                                    {/* Restaurant-specific fields */}
                                    {!isLogin && role === 'restaurant' && (
                                        <>
                                            <View>
                                                <Text className="text-white mb-2 ml-1">Restaurant Name</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: restaurantNameFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter restaurant name"
                                                    placeholderTextColor="#666"
                                                    value={restaurantName}
                                                    onChangeText={setRestaurantName}
                                                    onFocus={() => setRestaurantNameFocused(true)}
                                                    onBlur={() => setRestaurantNameFocused(false)}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Owner Name</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: ownerNameFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter owner full name"
                                                    placeholderTextColor="#666"
                                                    value={ownerName}
                                                    onChangeText={setOwnerName}
                                                    onFocus={() => setOwnerNameFocused(true)}
                                                    onBlur={() => setOwnerNameFocused(false)}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Restaurant Phone</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: restaurantPhoneFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter restaurant contact number"
                                                    placeholderTextColor="#666"
                                                    keyboardType="phone-pad"
                                                    value={restaurantPhone}
                                                    onChangeText={setRestaurantPhone}
                                                    onFocus={() => setRestaurantPhoneFocused(true)}
                                                    onBlur={() => setRestaurantPhoneFocused(false)}
                                                />
                                            </View>

                                            <View>
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

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Restaurant Address</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: restaurantAddressFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter complete restaurant address"
                                                    placeholderTextColor="#666"
                                                    value={restaurantAddress}
                                                    onChangeText={setRestaurantAddress}
                                                    onFocus={() => setRestaurantAddressFocused(true)}
                                                    onBlur={() => setRestaurantAddressFocused(false)}
                                                    multiline
                                                    numberOfLines={2}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">FSSAI License Number</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: fssaiFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="14-digit FSSAI license number"
                                                    placeholderTextColor="#666"
                                                    keyboardType="number-pad"
                                                    maxLength={14}
                                                    value={fssaiLicense}
                                                    onChangeText={setFssaiLicense}
                                                    onFocus={() => setFssaiFocused(true)}
                                                    onBlur={() => setFssaiFocused(false)}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">GST Number</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: gstFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter GST number"
                                                    placeholderTextColor="#666"
                                                    value={gstNumber}
                                                    onChangeText={setGstNumber}
                                                    onFocus={() => setGstFocused(true)}
                                                    onBlur={() => setGstFocused(false)}
                                                    autoCapitalize="characters"
                                                    maxLength={15}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Operating Hours</Text>
                                                <View className="flex-row gap-2">
                                                    <View className="flex-1">
                                                        <TextInput
                                                            className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                            style={{
                                                                borderWidth: 2,
                                                                borderColor: openingTimeFocused ? '#1DB954' : '#333'
                                                            }}
                                                            placeholder="Opening (e.g., 09:00 AM)"
                                                            placeholderTextColor="#666"
                                                            value={openingTime}
                                                            onChangeText={setOpeningTime}
                                                            onFocus={() => setOpeningTimeFocused(true)}
                                                            onBlur={() => setOpeningTimeFocused(false)}
                                                        />
                                                    </View>
                                                    <View className="flex-1">
                                                        <TextInput
                                                            className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                            style={{
                                                                borderWidth: 2,
                                                                borderColor: closingTimeFocused ? '#1DB954' : '#333'
                                                            }}
                                                            placeholder="Closing (e.g., 11:00 PM)"
                                                            placeholderTextColor="#666"
                                                            value={closingTime}
                                                            onChangeText={setClosingTime}
                                                            onFocus={() => setClosingTimeFocused(true)}
                                                            onBlur={() => setClosingTimeFocused(false)}
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">Bank Account Number</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: bankAccountFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter account number"
                                                    placeholderTextColor="#666"
                                                    keyboardType="number-pad"
                                                    value={bankAccountNumber}
                                                    onChangeText={setBankAccountNumber}
                                                    onFocus={() => setBankAccountFocused(true)}
                                                    onBlur={() => setBankAccountFocused(false)}
                                                />
                                            </View>

                                            <View>
                                                <Text className="text-white mb-2 ml-1">IFSC Code</Text>
                                                <TextInput
                                                    className="w-full bg-[#1E1E1E] text-white p-4 rounded-xl"
                                                    style={{
                                                        borderWidth: 2,
                                                        borderColor: ifscFocused ? '#1DB954' : '#333'
                                                    }}
                                                    placeholder="Enter IFSC code"
                                                    placeholderTextColor="#666"
                                                    value={ifscCode}
                                                    onChangeText={setIfscCode}
                                                    onFocus={() => setIfscFocused(true)}
                                                    onBlur={() => setIfscFocused(false)}
                                                    autoCapitalize="characters"
                                                />
                                            </View>
                                        </>
                                    )}

                                    <TouchableOpacity
                                        className="w-full bg-[#1DB954] p-4 rounded-xl items-center mt-6 shadow-lg shadow-green-900/50"
                                        onPress={handleAuth}
                                    >
                                        <Text className="text-black font-bold text-lg">
                                            {isLogin ? `Login as ${role}` : `Register as ${role}`}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => setIsLogin(!isLogin)} className="mt-4 items-center">
                                        <Text className="text-[#A0A0A0]">
                                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                                            <Text className="text-[#1DB954] font-bold">{isLogin ? 'Register' : 'Login'}</Text>
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => navigation.goBack()}
                                    className="mt-10 items-center"
                                >
                                    <Text className="text-[#666]">← Select a different role</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </View>
        </View>
    );
}
