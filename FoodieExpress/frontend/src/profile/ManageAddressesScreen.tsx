import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    landmark?: string;
    isDefault: boolean;
}

export default function ManageAddressesScreen() {
    const navigation = useNavigation<any>();
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            type: 'home',
            name: 'Home',
            street: '123 Main Street, Apt 4B',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            landmark: 'Near Central Park',
            isDefault: true
        },
        {
            id: '2',
            type: 'work',
            name: 'Office',
            street: '456 Business Ave, Floor 10',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            landmark: 'Next to Starbucks',
            isDefault: false
        }
    ]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'home': return '🏠';
            case 'work': return '💼';
            case 'other': return '📍';
            default: return '📍';
        }
    };

    const handleSetDefault = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
        Alert.alert('Success', 'Default address updated!');
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            'Delete Address',
            'Are you sure you want to delete this address?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setAddresses(addresses.filter(addr => addr.id !== id));
                    }
                }
            ]
        );
    };

    const handleAddNew = () => {
        Alert.alert('Coming Soon', 'Add new address feature will be available soon!');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 border-b border-[#333] flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                        <Text className="text-[#1DB954] text-2xl">←</Text>
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Manage Addresses</Text>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
                {/* Add New Address Button */}
                <TouchableOpacity
                    className="mb-4 bg-[#1DB954] p-4 rounded-xl flex-row items-center justify-center"
                    onPress={handleAddNew}
                >
                    <Text className="text-2xl mr-2">➕</Text>
                    <Text className="text-black font-bold text-lg">Add New Address</Text>
                </TouchableOpacity>

                {/* Saved Addresses */}
                <Text className="text-[#A0A0A0] uppercase text-xs font-bold mb-3 ml-2">
                    Saved Addresses ({addresses.length})
                </Text>

                {addresses.length === 0 ? (
                    <View className="items-center justify-center py-20">
                        <Text className="text-6xl mb-4">📍</Text>
                        <Text className="text-white text-xl font-bold mb-2">No addresses saved</Text>
                        <Text className="text-[#A0A0A0] text-center">
                            Add your delivery addresses for faster checkout
                        </Text>
                    </View>
                ) : (
                    addresses.map((address) => (
                        <View
                            key={address.id}
                            className="mb-4 bg-[#1E1E1E] rounded-2xl border-2 border-[#333] overflow-hidden"
                            style={{
                                borderColor: address.isDefault ? '#1DB954' : '#333'
                            }}
                        >
                            {/* Address Header */}
                            <View className="p-4 flex-row items-start justify-between">
                                <View className="flex-1">
                                    <View className="flex-row items-center mb-2">
                                        <Text className="text-2xl mr-2">{getTypeIcon(address.type)}</Text>
                                        <Text className="text-white font-bold text-lg">{address.name}</Text>
                                        {address.isDefault && (
                                            <View className="ml-2 bg-[#1DB954] px-2 py-1 rounded-full">
                                                <Text className="text-black text-xs font-bold">Default</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text className="text-[#A0A0A0] text-sm mb-1">{address.street}</Text>
                                    <Text className="text-[#A0A0A0] text-sm mb-1">
                                        {address.city}, {address.state} {address.zipCode}
                                    </Text>
                                    {address.landmark && (
                                        <Text className="text-[#666] text-xs mt-1">
                                            📍 {address.landmark}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="px-4 py-3 bg-[#121212] flex-row">
                                {!address.isDefault && (
                                    <TouchableOpacity
                                        className="flex-1 bg-[#1E1E1E] py-2 rounded-lg mr-2 border border-[#1DB954]"
                                        onPress={() => handleSetDefault(address.id)}
                                    >
                                        <Text className="text-[#1DB954] text-center font-bold text-sm">
                                            Set as Default
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    className="flex-1 bg-[#1E1E1E] py-2 rounded-lg mr-2 border border-[#333]"
                                    onPress={() => Alert.alert('Coming Soon', 'Edit address feature will be available soon!')}
                                >
                                    <Text className="text-white text-center font-bold text-sm">Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-[#1E1E1E] px-4 py-2 rounded-lg border border-red-900/30"
                                    onPress={() => handleDelete(address.id)}
                                >
                                    <Text className="text-red-500 font-bold text-sm">🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
