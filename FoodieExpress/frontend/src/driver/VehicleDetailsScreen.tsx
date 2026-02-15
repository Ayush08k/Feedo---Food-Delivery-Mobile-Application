import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';

interface Vehicle {
    id: number;
    type: 'bike' | 'car';
    number: string;
    model: string;
    color: string;
    year: string;
    isActive: boolean;
}

export default function VehicleDetailsScreen() {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();
    const [showAddVehicle, setShowAddVehicle] = useState(false);

    const [vehicles, setVehicles] = useState<Vehicle[]>([
        { id: 1, type: 'bike', number: 'ABC-1234', model: 'Honda Activa', color: 'Red', year: '2022', isActive: true },
        { id: 2, type: 'car', number: 'XYZ-5678', model: 'Maruti Swift', color: 'White', year: '2021', isActive: false },
    ]);

    const [newVehicle, setNewVehicle] = useState({
        type: 'bike' as 'bike' | 'car',
        number: '',
        model: '',
        color: '',
        year: ''
    });

    const setActiveVehicle = (id: number) => {
        setVehicles(vehicles.map(v => ({ ...v, isActive: v.id === id })));
        showAlert('Success', 'Active vehicle updated successfully!');
    };

    const handleAddVehicle = () => {
        if (!newVehicle.number || !newVehicle.model) {
            showAlert('Error', 'Please fill all required fields');
            return;
        }

        const vehicle: Vehicle = {
            id: vehicles.length + 1,
            ...newVehicle,
            isActive: vehicles.length === 0
        };

        setVehicles([...vehicles, vehicle]);
        setNewVehicle({ type: 'bike', number: '', model: '', color: '', year: '' });
        setShowAddVehicle(false);
        showAlert('Success', 'Vehicle added successfully!');
    };

    const deleteVehicle = (id: number) => {
        showAlert(
            'Delete Vehicle',
            'Are you sure you want to delete this vehicle?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setVehicles(vehicles.filter(v => v.id !== id))
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="mr-4 p-2 rounded-full bg-[#1E1E1E]"
                        >
                            <Text className="text-white">←</Text>
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white text-2xl font-bold">Vehicle Details</Text>
                            <Text className="text-[#A0A0A0] text-sm">{vehicles.length} registered</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="bg-[#1DB954] px-4 py-2 rounded-full"
                        onPress={() => setShowAddVehicle(!showAddVehicle)}
                    >
                        <Text className="text-black font-bold">{showAddVehicle ? 'Cancel' : '+ Add'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Add New Vehicle Form */}
                {showAddVehicle && (
                    <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] my-4">
                        <Text className="text-white text-lg font-bold mb-4">Add New Vehicle</Text>

                        <View className="mb-4">
                            <Text className="text-[#A0A0A0] mb-2">Vehicle Type</Text>
                            <View className="flex-row space-x-2">
                                <TouchableOpacity
                                    className={`flex-1 p-3 rounded-xl border-2 ${newVehicle.type === 'bike' ? 'bg-[#1DB954] border-[#1DB954]' : 'bg-[#121212] border-[#333]'}`}
                                    onPress={() => setNewVehicle({ ...newVehicle, type: 'bike' })}
                                >
                                    <Text className={`text-center font-bold ${newVehicle.type === 'bike' ? 'text-black' : 'text-white'}`}>🏍️ Bike</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`flex-1 p-3 rounded-xl border-2 ${newVehicle.type === 'car' ? 'bg-[#1DB954] border-[#1DB954]' : 'bg-[#121212] border-[#333]'}`}
                                    onPress={() => setNewVehicle({ ...newVehicle, type: 'car' })}
                                >
                                    <Text className={`text-center font-bold ${newVehicle.type === 'car' ? 'text-black' : 'text-white'}`}>🚗 Car</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className="text-[#A0A0A0] mb-2">Vehicle Number *</Text>
                            <TextInput
                                className="bg-[#121212] text-white p-3 rounded-xl border-2 border-[#333]"
                                placeholder="e.g., ABC-1234"
                                placeholderTextColor="#666"
                                value={newVehicle.number}
                                onChangeText={(text) => setNewVehicle({ ...newVehicle, number: text })}
                                autoCapitalize="characters"
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-[#A0A0A0] mb-2">Model/Brand *</Text>
                            <TextInput
                                className="bg-[#121212] text-white p-3 rounded-xl border-2 border-[#333]"
                                placeholder="e.g., Honda Activa"
                                placeholderTextColor="#666"
                                value={newVehicle.model}
                                onChangeText={(text) => setNewVehicle({ ...newVehicle, model: text })}
                            />
                        </View>

                        <View className="flex-row space-x-2 mb-4">
                            <View className="flex-1">
                                <Text className="text-[#A0A0A0] mb-2">Color</Text>
                                <TextInput
                                    className="bg-[#121212] text-white p-3 rounded-xl border-2 border-[#333]"
                                    placeholder="Color"
                                    placeholderTextColor="#666"
                                    value={newVehicle.color}
                                    onChangeText={(text) => setNewVehicle({ ...newVehicle, color: text })}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-[#A0A0A0] mb-2">Year</Text>
                                <TextInput
                                    className="bg-[#121212] text-white p-3 rounded-xl border-2 border-[#333]"
                                    placeholder="Year"
                                    placeholderTextColor="#666"
                                    value={newVehicle.year}
                                    onChangeText={(text) => setNewVehicle({ ...newVehicle, year: text })}
                                    keyboardType="number-pad"
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            className="bg-[#1DB954] p-3 rounded-xl"
                            onPress={handleAddVehicle}
                        >
                            <Text className="text-black font-bold text-center">Add Vehicle</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Registered Vehicles */}
                <View className="py-4">
                    <Text className="text-white text-xl font-bold mb-4">Registered Vehicles</Text>
                    {vehicles.map((vehicle) => (
                        <View key={vehicle.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-row items-center flex-1">
                                    <Text className="text-4xl mr-3">{vehicle.type === 'bike' ? '🏍️' : '🚗'}</Text>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg">{vehicle.model}</Text>
                                        <Text className="text-[#A0A0A0]">{vehicle.number}</Text>
                                    </View>
                                </View>
                                {vehicle.isActive && (
                                    <View className="bg-[#1DB95420] border border-[#1DB954] px-3 py-1 rounded-full">
                                        <Text className="text-[#1DB954] text-xs font-bold">Active</Text>
                                    </View>
                                )}
                            </View>

                            <View className="flex-row justify-between mb-3">
                                <View>
                                    <Text className="text-[#666] text-xs">Color</Text>
                                    <Text className="text-white">{vehicle.color || 'N/A'}</Text>
                                </View>
                                <View>
                                    <Text className="text-[#666] text-xs">Year</Text>
                                    <Text className="text-white">{vehicle.year || 'N/A'}</Text>
                                </View>
                                <View>
                                    <Text className="text-[#666] text-xs">Type</Text>
                                    <Text className="text-white capitalize">{vehicle.type}</Text>
                                </View>
                            </View>

                            <View className="flex-row space-x-2 pt-3 border-t border-[#333]">
                                {!vehicle.isActive && (
                                    <TouchableOpacity
                                        className="flex-1 bg-[#121212] border border-[#1DB954] px-4 py-2 rounded-lg"
                                        onPress={() => setActiveVehicle(vehicle.id)}
                                    >
                                        <Text className="text-[#1DB954] text-center font-bold text-sm">Set Active</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity
                                    className="flex-1 bg-[#121212] border border-[#FF6B6B] px-4 py-2 rounded-lg"
                                    onPress={() => deleteVehicle(vehicle.id)}
                                >
                                    <Text className="text-[#FF6B6B] text-center font-bold text-sm">Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
