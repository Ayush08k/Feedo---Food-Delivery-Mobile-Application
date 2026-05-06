import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useCart } from './CartContext';
import { useLanguage } from '../utils/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

const RECOMMENDED_ITEMS = [
    { id: 901, name: 'Coca Cola', price: 1.5, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200&h=200&fit=crop' },
    { id: 902, name: 'French Fries', price: 2.99, image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=200&h=200&fit=crop' },
    { id: 903, name: 'Choco Lava Cake', price: 4.5, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=200&h=200&fit=crop' },
];

export default function CartScreen() {
    const navigation = useNavigation<any>();
    const { items, addToCart, removeOneFromCart, total } = useCart();
    const { t } = useLanguage();

    const deliveryFee = 2.00;
    const platformFee = 0.50;
    const taxes = total * 0.05; // 5% tax
    const grandTotal = total + deliveryFee + platformFee + taxes;

    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center">
                <Ionicons name="cart-outline" size={100} color="#333" />
                <Text className="text-[#A0A0A0] text-xl mb-6 mt-4">{t('cart.empty') || "Your cart is empty"}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('RestaurantsList')}
                    className="bg-[#1DB954] px-8 py-4 rounded-full"
                >
                    <Text className="text-black font-bold text-lg">{t('cart.browseRestaurants') || "Browse Restaurants"}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const currentRestaurantId = items.length > 0 ? items[0].restaurantId : 0;

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            <View className="px-4 py-4 bg-[#1E1E1E] flex-row items-center border-b border-[#333]">
                <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold">{t('cart.title') || "Cart"}</Text>
            </View>

            <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
                {/* Cart Items */}
                <View className="bg-[#1E1E1E] px-4 py-2 mx-4 rounded-xl border border-[#333] mb-6">
                    {items.map((item, index) => (
                        <View key={item.id} className={`flex-row justify-between items-center py-4 ${index !== items.length - 1 ? 'border-b border-[#333]' : ''}`}>
                            <View className="flex-1 mr-2">
                                <Text className="text-white text-base font-bold">{item.name}</Text>
                                <Text className="text-[#1DB954] font-bold text-sm mt-1">${item.price.toFixed(2)}</Text>
                            </View>
                            <View className="flex-row items-center bg-[#2A2A2A] rounded-lg overflow-hidden border border-[#444]">
                                <TouchableOpacity 
                                    onPress={() => removeOneFromCart(item.id)}
                                    className="px-3 py-2 bg-[#333]"
                                >
                                    <Ionicons name="remove" size={16} color="white" />
                                </TouchableOpacity>
                                <Text className="text-white font-bold px-4">{item.quantity}</Text>
                                <TouchableOpacity 
                                    onPress={() => addToCart(item, currentRestaurantId)}
                                    className="px-3 py-2 bg-[#333]"
                                >
                                    <Ionicons name="add" size={16} color="#1DB954" />
                                </TouchableOpacity>
                            </View>
                            <Text className="text-white font-bold text-base w-16 text-right">${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Recommended Add-ons */}
                <View className="mb-6">
                    <Text className="text-white font-bold text-lg px-4 mb-3">Complete your meal</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pl-4">
                        {RECOMMENDED_ITEMS.map((item) => (
                            <View key={item.id} className="bg-[#1E1E1E] p-3 rounded-xl border border-[#333] mr-4 w-32 items-center">
                                <Image source={{ uri: item.image }} className="w-20 h-20 rounded-full mb-2" />
                                <Text className="text-white font-bold text-sm text-center h-10" numberOfLines={2}>{item.name}</Text>
                                <View className="flex-row items-center justify-between w-full mt-2">
                                    <Text className="text-[#A0A0A0] text-sm">${item.price.toFixed(2)}</Text>
                                    <TouchableOpacity 
                                        onPress={() => addToCart(item, currentRestaurantId)}
                                        className="bg-[#2A2A2A] border border-[#1DB954] px-2 py-1 rounded"
                                    >
                                        <Text className="text-[#1DB954] text-xs font-bold">ADD</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                        <View className="w-4" /> {/* Spacer */}
                    </ScrollView>
                </View>

                {/* Bill Details */}
                <View className="bg-[#1E1E1E] p-4 mx-4 rounded-xl border border-[#333] mb-8">
                    <Text className="text-white font-bold text-lg mb-4 border-b border-[#333] pb-2">Bill Details</Text>
                    
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-[#A0A0A0]">Item Total</Text>
                        <Text className="text-white">${total.toFixed(2)}</Text>
                    </View>
                    
                    <View className="flex-row justify-between mb-3">
                        <Text className="text-[#A0A0A0]">Delivery Fee</Text>
                        <Text className="text-white">${deliveryFee.toFixed(2)}</Text>
                    </View>
                    
                    <View className="flex-row justify-between mb-3 border-b border-[#333] pb-3">
                        <View className="flex-row items-center">
                            <Text className="text-[#A0A0A0] mr-1">Taxes & Platform Fee</Text>
                            <Ionicons name="information-circle-outline" size={14} color="#A0A0A0" />
                        </View>
                        <Text className="text-white">${(platformFee + taxes).toFixed(2)}</Text>
                    </View>
                    
                    <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-white font-bold text-lg">To Pay</Text>
                        <Text className="text-white font-bold text-xl">${grandTotal.toFixed(2)}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Checkout Bar */}
            <View className="p-4 bg-[#1E1E1E] border-t border-[#333] flex-row items-center justify-between">
                <View>
                    <Text className="text-[#1DB954] font-bold text-xl">${grandTotal.toFixed(2)}</Text>
                    <Text className="text-[#A0A0A0] text-xs font-bold mt-1">VIEW DETAILED BILL</Text>
                </View>
                <TouchableOpacity
                    className="bg-[#1DB954] px-8 py-4 rounded-xl items-center shadow-lg shadow-green-900/50"
                    onPress={() => navigation.navigate('Checkout')}
                >
                    <Text className="text-black font-bold text-lg">Proceed to Pay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
