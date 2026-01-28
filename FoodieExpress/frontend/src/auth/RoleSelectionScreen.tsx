import React from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ScaleButton = ({ onPress, children }: { onPress: () => void; children: React.ReactNode }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="mb-2 bg-[#1E1E1E] p-6 rounded-2xl border border-[#333] flex-row items-center justify-center active:scale-95 active:border-[#1DB954]"
        >
            {children}
        </TouchableOpacity>
    );
};

export default function RoleSelectionScreen() {
    const navigation = useNavigation<any>();

    const handleRoleSelect = (role: 'user' | 'driver' | 'restaurant') => {
        navigation.navigate('Auth', { role });
    };

    return (
        <ImageBackground
            source={require('../../assets/bg-image.jpg')}
            className="flex-1"
            resizeMode="cover"
        >
            <View className="flex-1 bg-black/67">
                <SafeAreaView className="flex-1 justify-center px-6">
                    {/* Glassmorphism Blur Container */}
                    <View className="bg-black/50 backdrop-blur-3xl rounded-3xl p-8 border border-white/30">
                        <View className="items-center mb-6 w-full">
                            <Image
                                source={require('../../assets/logo.png')}
                                style={{ width: '50%', height: 120 }}
                                resizeMode="contain"
                                className="mb-0"
                            />
                            <Text className="text-[#A0A0A0] text-xl tracking-widest uppercase">Midnight Craving</Text>
                        </View>

                        <View>
                            <ScaleButton onPress={() => handleRoleSelect('user')}>
                                <Text className="text-4xl mr-4">🍔</Text>
                                <View>
                                    <Text className="text-white text-xl font-bold">I want to order</Text>
                                    <Text className="text-[#666]">Browse restaurants & eat</Text>
                                </View>
                            </ScaleButton>

                            <ScaleButton onPress={() => handleRoleSelect('driver')}>
                                <Text className="text-4xl mr-4">🛵</Text>
                                <View>
                                    <Text className="text-white text-xl font-bold">I want to deliver</Text>
                                    <Text className="text-[#666]">Earn money driving</Text>
                                </View>
                            </ScaleButton>

                            <ScaleButton onPress={() => handleRoleSelect('restaurant')}>
                                <Text className="text-4xl mr-4">🏪</Text>
                                <View>
                                    <Text className="text-white text-xl font-bold">I own a restaurant</Text>
                                    <Text className="text-[#666]">Manage orders & menu</Text>
                                </View>
                            </ScaleButton>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </ImageBackground>
    );
}
