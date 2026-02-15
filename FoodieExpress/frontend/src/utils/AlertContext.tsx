import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface AlertContextType {
    showAlert: (title: string, message: string, buttons?: AlertButton[]) => void;
    hideAlert: () => void;
}

interface AlertState {
    visible: boolean;
    title: string;
    message: string;
    buttons: AlertButton[];
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alertState, setAlertState] = useState<AlertState>({
        visible: false,
        title: '',
        message: '',
        buttons: []
    });

    const showAlert = (title: string, message: string, buttons?: AlertButton[]) => {
        setAlertState({
            visible: true,
            title,
            message,
            buttons: buttons || [{ text: 'OK', style: 'default' }]
        });
    };

    const hideAlert = () => {
        setAlertState((prev) => ({ ...prev, visible: false }));
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            {alertState.visible && (
                <CustomAlertModal
                    title={alertState.title}
                    message={alertState.message}
                    buttons={alertState.buttons}
                    onDismiss={hideAlert}
                />
            )}
        </AlertContext.Provider>
    );
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error('useAlert must be used within an AlertProvider');
    return context;
};

// Custom Alert Modal Component
import { Modal, View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';

interface CustomAlertModalProps {
    title: string;
    message: string;
    buttons: AlertButton[];
    onDismiss: () => void;
}

function CustomAlertModal({ title, message, buttons, onDismiss }: CustomAlertModalProps) {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 100,
                friction: 8,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleButtonPress = (button: AlertButton) => {
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 0.8,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onDismiss();
            if (button.onPress) {
                button.onPress();
            }
        });
    };

    const getButtonStyle = (button: AlertButton, index: number) => {
        if (button.style === 'destructive') {
            return 'bg-[#FF6B6B]';
        } else if (button.style === 'cancel') {
            return 'bg-[#333]';
        } else {
            return 'bg-[#1DB954]';
        }
    };

    const getButtonTextStyle = (button: AlertButton) => {
        if (button.style === 'cancel') {
            return 'text-white';
        } else {
            return 'text-black';
        }
    };

    return (
        <Modal transparent visible animationType="none">
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => handleButtonPress({ text: '', style: 'cancel' })}
                className="flex-1 justify-center items-center bg-black/70"
            >
                <Animated.View
                    style={{
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    }}
                    className="w-[85%] max-w-md"
                >
                    <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
                        <View className="bg-[#1a1a1a] rounded-3xl p-6 border-2 border-[#2a2a2a]">
                            {/* Title */}
                            <Text className="text-white text-xl font-bold text-center mb-3">
                                {title}
                            </Text>

                            {/* Message */}
                            <Text className="text-[#A0A0A0] text-base text-center mb-6 leading-6">
                                {message}
                            </Text>

                            {/* Buttons */}
                            <View className={buttons.length > 2 ? 'space-y-3' : 'flex-row gap-3'}>
                                {buttons.map((button, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleButtonPress(button)}
                                        className={`${getButtonStyle(button, index)} py-3 rounded-xl ${buttons.length > 2 ? 'w-full' : 'flex-1'}`}
                                    >
                                        <Text className={`${getButtonTextStyle(button)} text-center font-bold text-base`}>
                                            {button.text}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </TouchableOpacity>
        </Modal>
    );
}
