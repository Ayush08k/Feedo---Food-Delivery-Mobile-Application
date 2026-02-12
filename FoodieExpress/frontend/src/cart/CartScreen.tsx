import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from './CartContext';

export default function CartScreen() {
    const navigation = useNavigation<any>();
    const { items, removeFromCart, total } = useCart();

    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center">
                <Text className="text-[#A0A0A0] text-xl mb-4">Your cart is empty</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('RestaurantsList')}
                    className="bg-[#1DB954] px-6 py-3 rounded-full"
                >
                    <Text className="text-black font-bold">Browse Restaurants</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="px-4 py-4 border-b border-[#333]">
                <Text className="text-white text-2xl font-bold">Your Cart</Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {items.map((item) => (
                    <View key={item.id} className="flex-row justify-between items-center mb-6 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                        <View className="flex-1">
                            <Text className="text-white text-lg font-bold">{item.name}</Text>
                            <Text className="text-[#A0A0A0]">${item.price} x {item.quantity}</Text>
                        </View>
                        <View className="items-end">
                            <Text className="text-[#1DB954] font-bold text-lg">${item.price * item.quantity}</Text>
                            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                                <Text className="text-red-500 text-sm mt-1">Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View className="p-4 bg-[#1E1E1E] rounded-t-3xl border-t border-[#333]">
                <View className="flex-row justify-between mb-4">
                    <Text className="text-[#A0A0A0] text-lg">Total</Text>
                    <Text className="text-white text-2xl font-bold">${total.toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    className="bg-[#1DB954] py-4 rounded-xl items-center shadow-lg shadow-green-900/50"
                    onPress={() => navigation.navigate('Checkout')}
                >
                    <Text className="text-black font-bold text-lg">Proceed to Checkout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
