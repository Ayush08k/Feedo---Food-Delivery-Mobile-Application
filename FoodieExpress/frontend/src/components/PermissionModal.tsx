import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PermissionModalProps {
    visible: boolean;
    title: string;
    description: string;
    icon: string;
    onAllow: () => void;
    onDeny: () => void;
}

export default function PermissionModal({
    visible,
    title,
    description,
    icon,
    onAllow,
    onDeny
}: PermissionModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAllow = async () => {
        setIsLoading(true);

        // Show spinner for 2 seconds
        setTimeout(() => {
            setIsLoading(false);
            onAllow();
        }, 2000);
    };

    // Get gradient colors based on permission type
    const getIconGradient = () => {
        if (icon === '📷') {
            return ['#FF6B9D', '#C06C84', '#6C5B7B'];
        } else if (icon === '👥') {
            return ['#667eea', '#764ba2', '#f093fb'];
        }
        return ['#1DB954', '#15883e', '#0e5a29'];
    };

    const iconGradient = getIconGradient();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent
        >
            {/* Blur Background with Gradient Overlay */}
            <View className="flex-1 bg-black/80 justify-center items-center px-5">
                {/* Modal Card */}
                <View className="bg-[#1A1A1A] rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
                    <LinearGradient
                        colors={['#1A1A1A', '#1E1E1E', '#1A1A1A']}
                        className="p-7"
                    >
                        {/* Animated Icon with Gradient Background */}
                        <View className="items-center mb-6">
                            <LinearGradient
                                colors={iconGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-24 h-24 rounded-3xl items-center justify-center mb-5 shadow-lg"
                                style={{
                                    shadowColor: iconGradient[0],
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 16,
                                }}
                            >
                                <Text className="text-6xl">{icon}</Text>
                            </LinearGradient>

                            <Text className="text-white text-2xl font-bold text-center mb-3">
                                {title}
                            </Text>
                            <Text className="text-[#A0A0A0] text-center text-base leading-6 px-2">
                                {description}
                            </Text>
                        </View>

                        {/* Buttons */}
                        <View className="mt-4 gap-3">
                            <TouchableOpacity
                                className="bg-[#1DB954] py-4 rounded-2xl shadow-lg"
                                style={{
                                    shadowColor: '#1DB954',
                                    shadowOffset: { width: 0, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 8,
                                }}
                                onPress={handleAllow}
                                activeOpacity={0.8}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <View className="flex-row justify-center items-center">
                                        <ActivityIndicator size="small" color="#000000" />
                                        <Text className="text-black text-center font-bold text-lg ml-2">
                                            Processing...
                                        </Text>
                                    </View>
                                ) : (
                                    <Text className="text-black text-center font-bold text-lg">
                                        ✓ Allow Access
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                className="bg-[#252525] py-4 rounded-2xl border-2 border-[#333]"
                                onPress={onDeny}
                                activeOpacity={0.8}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-center font-semibold text-base">
                                    Not Now
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Privacy Note */}
                        <View className="mt-5 pt-4 border-t border-[#333]">
                            <Text className="text-[#666] text-xs text-center leading-4">
                                🔒 Your privacy is important. We only use this permission when you need it.
                            </Text>
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
}
