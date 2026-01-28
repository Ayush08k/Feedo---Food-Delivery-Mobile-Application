import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

interface Offer {
    id: number;
    title: string;
    description: string;
    color: string;
    discountPercentage?: number;
    applicableItemIds?: number[];
}

interface FoodItem {
    id: number;
    name: string;
    restaurant: string;
    price: string;
    rating: number;
    image: string;
}

export default function OfferDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { offer } = route.params as { offer: Offer };
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock data for demonstration - in real app, fetch from backend
    const ALL_FOOD_ITEMS: FoodItem[] = [
        { id: 1, name: 'Classic Burger', restaurant: 'Burger King', price: '$8.99', rating: 4.8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
        { id: 2, name: 'Margherita Pizza', restaurant: 'Pizza Hut', price: '$12.99', rating: 4.9, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80' },
        { id: 3, name: 'California Roll', restaurant: 'Sushi Master', price: '$15.99', rating: 4.7, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80' },
        { id: 4, name: 'Chicken Wings', restaurant: 'Wings & More', price: '$10.99', rating: 4.6, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80' },
        { id: 5, name: 'Caesar Salad', restaurant: 'Healthy Greens', price: '$9.99', rating: 4.5, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&q=80' },
        { id: 6, name: 'Pasta Carbonara', restaurant: 'Italian Corner', price: '$14.99', rating: 4.8, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80' },
        { id: 7, name: 'Tacos', restaurant: 'Mexican Fiesta', price: '$11.99', rating: 4.7, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=80' },
        { id: 8, name: 'Fried Rice', restaurant: 'Asian Wok', price: '$10.49', rating: 4.6, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80' },
    ];

    useEffect(() => {
        // Simulate API call to fetch applicable items
        setTimeout(() => {
            if (offer.applicableItemIds && offer.applicableItemIds.length > 0) {
                const filteredItems = ALL_FOOD_ITEMS.filter(item =>
                    offer.applicableItemIds?.includes(item.id)
                );
                setFoodItems(filteredItems);
            } else {
                // If no specific items, show all items
                setFoodItems(ALL_FOOD_ITEMS);
            }
            setLoading(false);
        }, 500);
    }, [offer]);

    const calculateDiscountedPrice = (price: string) => {
        if (!offer.discountPercentage) return null;
        const numPrice = parseFloat(price.replace('$', ''));
        const discounted = numPrice * (1 - offer.discountPercentage / 100);
        return `$${discounted.toFixed(2)}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#1E1E1E] border-b border-[#333]">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-2 rounded-full bg-[#121212]"
                    >
                        <Text className="text-white text-xl">←</Text>
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-2xl font-bold mb-1" style={{ color: offer.color }}>
                            {offer.title}
                        </Text>
                        <Text className="text-[#A0A0A0] text-sm">{offer.description}</Text>
                    </View>
                </View>
            </View>

            {/* Offer Banner */}
            <View
                className="mx-4 mt-4 p-6 rounded-2xl border-2"
                style={{ backgroundColor: offer.color + '15', borderColor: offer.color }}
            >
                <View className="flex-row items-center justify-between">
                    <View>
                        <Text className="text-white text-lg font-bold mb-1">
                            {offer.discountPercentage ? `${offer.discountPercentage}% Discount` : offer.title}
                        </Text>
                        <Text className="text-[#A0A0A0]">{offer.description}</Text>
                    </View>
                    <View
                        className="w-16 h-16 rounded-full items-center justify-center"
                        style={{ backgroundColor: offer.color }}
                    >
                        <Text className="text-white text-2xl font-bold">
                            {offer.discountPercentage ? `${offer.discountPercentage}%` : '🎁'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Title */}
            <View className="px-4 mt-6 mb-4">
                <Text className="text-white text-2xl font-bold">Available Items</Text>
                <Text className="text-[#A0A0A0] text-sm mt-1">
                    {foodItems.length} items available with this offer
                </Text>
            </View>

            {/* Food Items Grid */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {loading ? (
                    <View className="flex-1 items-center justify-center py-20">
                        <ActivityIndicator size="large" color="#1DB954" />
                        <Text className="text-[#A0A0A0] mt-4">Loading items...</Text>
                    </View>
                ) : (
                    <View className="pb-20">
                        {foodItems.map((item) => {
                            const discountedPrice = calculateDiscountedPrice(item.price);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    className="mb-4 bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#333] flex-row"
                                    onPress={() => (navigation as any).navigate('FoodItemDetails', { item })}
                                >
                                    {/* Image */}
                                    <Image
                                        source={{ uri: item.image }}
                                        className="w-28 h-28"
                                        resizeMode="cover"
                                    />

                                    {/* Details */}
                                    <View className="flex-1 p-3 justify-between">
                                        <View>
                                            <Text className="text-white font-bold text-base mb-1">
                                                {item.name}
                                            </Text>
                                            <Text className="text-[#666] text-xs mb-2">
                                                {item.restaurant}
                                            </Text>
                                        </View>

                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center">
                                                {discountedPrice ? (
                                                    <View>
                                                        <Text className="text-[#1DB954] font-bold text-lg">
                                                            {discountedPrice}
                                                        </Text>
                                                        <Text className="text-[#666] text-xs line-through">
                                                            {item.price}
                                                        </Text>
                                                    </View>
                                                ) : (
                                                    <Text className="text-[#1DB954] font-bold text-lg">
                                                        {item.price}
                                                    </Text>
                                                )}
                                            </View>

                                            <View className="flex-row items-center">
                                                <View className="flex-row items-center bg-[#121212] px-2 py-1 rounded-lg mr-2">
                                                    <Text className="text-[#1DB954] font-bold text-xs mr-1">★</Text>
                                                    <Text className="text-white text-xs">{item.rating}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    className="px-4 py-2 rounded-lg"
                                                    style={{ backgroundColor: offer.color }}
                                                >
                                                    <Text className="text-white font-bold text-xs">Add +</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
