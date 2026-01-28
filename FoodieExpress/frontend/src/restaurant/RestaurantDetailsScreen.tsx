import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useCart } from '../cart/CartContext';

const MENU_ITEMS = [
    { id: 1, name: 'Double Cheeseburger', description: 'Two beef patties, cheddar, lettuce, tomato, house sauce.', price: 14, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
    { id: 2, name: 'Truffle Fries', description: 'Crispy fries with truffle oil and parmesan.', price: 8, image: 'https://images.unsplash.com/photo-1573080496987-a2267f70b77b?w=800&q=80' },
    { id: 3, name: 'Milkshake', description: 'Classic vanilla bean milkshake.', price: 6, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80' },
];

export default function RestaurantDetailsScreen() {
    const navigation = useNavigation<any>();
    const { addToCart, items, total } = useCart();
    const route = useRoute<any>();
    const { restaurant } = route.params || { restaurant: { name: 'Restaurant Name', rating: 4.8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' } };

    return (
        <View className="flex-1 bg-[#121212]">
            {/* Header Image */}
            <View className="relative h-64">
                <Image source={{ uri: restaurant.image }} className="w-full h-full" resizeMode="cover" />
                <TouchableOpacity
                    className="absolute top-12 left-4 bg-black/50 p-2 rounded-full"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-bold text-lg">←</Text>
                </TouchableOpacity>
            </View>

            {/* Info Content */}
            <ScrollView className="flex-1 -mt-6 bg-[#121212] rounded-t-3xl pt-6 px-4">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-white text-3xl font-bold flex-1 mr-2">{restaurant.name}</Text>
                    <View className="bg-[#1DB954] px-3 py-1 rounded-lg">
                        <Text className="text-black font-bold text-base">★ {restaurant.rating}</Text>
                    </View>
                </View>
                <Text className="text-[#A0A0A0] mb-6">Burger • American • 20-30 min</Text>

                <Text className="text-white text-xl font-bold mb-4">Menu</Text>

                {MENU_ITEMS.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate('FoodItemDetails', {
                            item: {
                                ...item,
                                price: `$${item.price}`,
                                rating: 4.8,
                                restaurant: restaurant.name
                            }
                        })}
                    >
                        <View className="flex-row mb-6 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                            <View className="flex-1 mr-4">
                                <Text className="text-white text-lg font-bold mb-1">{item.name}</Text>
                                <Text className="text-[#A0A0A0] text-sm mb-2" numberOfLines={2}>{item.description}</Text>
                                <Text className="text-[#1DB954] font-bold text-lg">${item.price}</Text>
                            </View>
                            <View className="items-center justify-between">
                                <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg mb-2" />
                                <TouchableOpacity
                                    className="bg-[#1DB954] px-3 py-1 rounded-full"
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        addToCart(item, restaurant.id || 1);
                                    }}
                                >
                                    <Text className="text-black font-bold text-sm">+ Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                {/* Padding for bottom floating button */}
                <View className="h-24" />
            </ScrollView>

            {/* Floating Cart Button */}
            <View className="absolute bottom-8 left-4 right-4">
                {items.length > 0 && (
                    <TouchableOpacity
                        className="bg-[#1DB954] p-4 rounded-xl flex-row justify-between items-center shadow-lg shadow-green-900/50"
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <View className="bg-black/20 px-2 py-1 rounded">
                            <Text className="text-black font-bold">{items.reduce((s, i) => s + i.quantity, 0)} items</Text>
                        </View>
                        <Text className="text-black font-bold text-lg">View Cart</Text>
                        <Text className="text-black font-bold text-lg">${total.toFixed(2)}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
