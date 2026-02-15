import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';

interface PaymentMethod {
    id: string;
    type: 'card' | 'upi' | 'wallet';
    name: string;
    details: string;
    isDefault: boolean;
}

export default function PaymentMethodsScreen() {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'card',
            name: 'Visa Card',
            details: '**** **** **** 4242',
            isDefault: true
        },
        {
            id: '2',
            type: 'upi',
            name: 'Google Pay',
            details: 'user@oksbi',
            isDefault: false
        },
        {
            id: '3',
            type: 'wallet',
            name: 'Paytm Wallet',
            details: 'Balance: $25.50',
            isDefault: false
        }
    ]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'card': return '💳';
            case 'upi': return '📱';
            case 'wallet': return '👛';
            default: return '💰';
        }
    };

    const handleSetDefault = (id: string) => {
        setPaymentMethods(paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
        })));
        showAlert('Success', 'Default payment method updated!');
    };

    const handleDelete = (id: string) => {
        showAlert(
            'Remove Payment Method',
            'Are you sure you want to remove this payment method?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setPaymentMethods(paymentMethods.filter(method => method.id !== id));
                    }
                }
            ]
        );
    };

    const handleAddNew = () => {
        showAlert('Coming Soon', 'Add new payment method feature will be available soon!');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 border-b border-[#333] flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Text className="text-[#1DB954] text-2xl">←</Text>
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">Payment Methods</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {/* Add New Payment Method */}
                <TouchableOpacity
                    className="mb-4 bg-[#1DB954] p-4 rounded-xl flex-row items-center justify-center"
                    onPress={handleAddNew}
                >
                    <Text className="text-2xl mr-2">➕</Text>
                    <Text className="text-black font-bold text-lg">Add Payment Method</Text>
                </TouchableOpacity>

                {/* Saved Payment Methods */}
                <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-3 ml-2">
                    Saved Methods ({paymentMethods.length})
                </Text>

                {paymentMethods.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <Text className="text-6xl mb-4">💳</Text>
                        <Text className="text-white text-xl font-bold mb-2">No payment methods</Text>
                        <Text className="text-[#A0A0A0] text-center">
                            Add your payment methods for faster checkout
                        </Text>
                    </View>
                ) : (
                    paymentMethods.map((method) => (
                        <View
                            key={method.id}
                            className="mb-4 bg-[#1E1E1E] rounded-2xl border-2 overflow-hidden"
                            style={{
                                borderColor: method.isDefault ? '#1DB954' : '#333'
                            }}
                        >
                            {/* Payment Method Info */}
                            <View className="p-4">
                                <View className="flex-row items-center justify-between mb-3">
                                    <View className="flex-row items-center flex-1">
                                        <Text className="text-3xl mr-3">{getTypeIcon(method.type)}</Text>
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-lg">{method.name}</Text>
                                            <Text className="text-[#A0A0A0] text-sm mt-1">{method.details}</Text>
                                        </View>
                                    </View>
                                    {method.isDefault && (
                                        <View className="bg-[#1DB954] px-3 py-1 rounded-full">
                                            <Text className="text-black text-xs font-bold">Default</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="px-4 py-3 bg-[#121212] flex-row">
                                {!method.isDefault && (
                                    <TouchableOpacity
                                        className="flex-1 bg-[#1E1E1E] py-2 rounded-lg mr-2 border border-[#1DB954]"
                                        onPress={() => handleSetDefault(method.id)}
                                    >
                                        <Text className="text-[#1DB954] text-center font-bold text-sm">
                                            Set as Default
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    className="bg-[#1E1E1E] px-4 py-2 rounded-lg border border-red-900/30"
                                    onPress={() => handleDelete(method.id)}
                                >
                                    <Text className="text-red-500 font-bold text-sm">Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}

                {/* Info Box */}
                <View className="mt-6 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                    <Text className="text-white font-bold mb-2">🔒 Secure Payments</Text>
                    <Text className="text-[#A0A0A0] text-sm">
                        Your payment information is encrypted and securely stored. We never share your financial details with restaurants or delivery partners.
                    </Text>
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
