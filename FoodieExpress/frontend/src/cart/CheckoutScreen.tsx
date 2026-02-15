import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from './CartContext';
import { useAlert } from '../utils/AlertContext';

export default function CheckoutScreen() {
    const navigation = useNavigation<any>();
    const { items, total, clearCart } = useCart();
    const { showAlert } = useAlert();
    const [loading, setLoading] = useState(false);
    const [address, setAddress] = useState('123 Main St, New York, NY');

    const handleOrder = async () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            clearCart();
            showAlert('Order Placed!', 'Your food is on the way.', [
                { text: 'Track Order', onPress: () => navigation.navigate('Main', { screen: 'Orders' }) },
                { text: 'Home', onPress: () => navigation.navigate('Main') }
            ]);
        }, 2000);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="px-4 py-4 border-b border-[#333] flex-row items-center">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Text className="text-white text-xl">←</Text>
                </TouchableOpacity>
                <Text className="text-white text-2xl font-bold">Checkout</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                <Text className="text-[#A0A0A0] mb-2 uppercase text-xs font-bold">Delivery Address</Text>
                <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-6">
                    <TextInput
                        value={address}
                        onChangeText={setAddress}
                        className="text-white text-lg"
                        multiline
                    />
                </View>

                <Text className="text-[#A0A0A0] mb-2 uppercase text-xs font-bold">Payment Method</Text>
                <TouchableOpacity className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-6 flex-row justify-between">
                    <Text className="text-white text-lg">💳 **** **** **** 4242</Text>
                    <Text className="text-[#1DB954]">Change</Text>
                </TouchableOpacity>

                <Text className="text-[#A0A0A0] mb-2 uppercase text-xs font-bold">Order Summary</Text>
                <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-6">
                    {items.map((item) => (
                        <View key={item.id} className="flex-row justify-between mb-2">
                            <Text className="text-white">{item.quantity}x {item.name}</Text>
                            <Text className="text-white">${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                    <View className="h-px bg-[#333] my-2" />
                    <View className="flex-row justify-between">
                        <Text className="text-white font-bold">Total</Text>
                        <Text className="text-[#1DB954] font-bold text-xl">${total.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            <View className="p-4 bg-[#1E1E1E] border-t border-[#333]">
                <TouchableOpacity
                    className="bg-[#1DB954] py-4 rounded-xl items-center shadow-lg shadow-green-900/50"
                    onPress={handleOrder}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text className="text-black font-bold text-lg">Place Order - ${total.toFixed(2)}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
