import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { filterFoodItems, filterRestaurants } from '../utils/searchUtils';

// Mock data - same as HomeScreen
const TOP_SELLERS = [
    { id: 1, name: 'Classic Burger', restaurant: 'Burger King', price: '$8.99', rating: 4.8, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', category: 'Burger' },
    { id: 2, name: 'Margherita Pizza', restaurant: 'Pizza Hut', price: '$12.99', rating: 4.9, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80', category: 'Pizza' },
    { id: 3, name: 'California Roll', restaurant: 'Sushi Master', price: '$15.99', rating: 4.7, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&q=80', category: 'Sushi' },
    { id: 4, name: 'Chicken Wings', restaurant: 'Wings & More', price: '$10.99', rating: 4.6, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80', category: 'Wings' },
];

const RESTAURANTS = [
    { id: 1, name: 'Gourmet Burger Kitchen', rating: 4.8, time: '20-30 min', offer: '20% OFF', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', cuisine: 'Burgers' },
    { id: 2, name: 'Sushi Master', rating: 4.9, time: '45-60 min', offer: 'Free Delivery', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80', cuisine: 'Japanese' },
    { id: 3, name: 'Pizza Palace', rating: 4.5, time: '15-25 min', offer: '30% OFF', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80', cuisine: 'Italian' },
    { id: 4, name: 'The Breakfast Club', rating: 4.7, time: '25-35 min', offer: 'Buy 1 Get 1', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80', cuisine: 'American' },
];

export default function SearchResultsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { query = '' } = route.params as { query: string };

    // Filter results based on search query
    const filteredFoodItems = useMemo(() => filterFoodItems(TOP_SELLERS, query), [query]);
    const filteredRestaurants = useMemo(() => filterRestaurants(RESTAURANTS, query), [query]);

    const totalResults = filteredFoodItems.length + filteredRestaurants.length;
    const hasResults = totalResults > 0;

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 border-b border-[#333]">
                <View className="flex-row items-center mb-2">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3 bg-[#1E1E1E] p-2 rounded-full"
                    >
                        <Text className="text-white text-lg">←</Text>
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-xl font-bold">Search Results</Text>
                        <Text className="text-[#A0A0A0] text-sm">
                            {query ? `"${query}"` : 'No query'}
                        </Text>
                    </View>
                </View>
                <Text className="text-[#1DB954] text-sm ml-12">
                    {totalResults} result{totalResults !== 1 ? 's' : ''} found
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {hasResults ? (
                    <>
                        {/* Food Items Section */}
                        {filteredFoodItems.length > 0 && (
                            <View className="px-4 py-4">
                                <Text className="text-white text-lg font-bold mb-4">
                                    Food Items ({filteredFoodItems.length})
                                </Text>
                                {filteredFoodItems.map(item => (
                                    <TouchableOpacity
                                        key={item.id}
                                        className="flex-row bg-[#1E1E1E] rounded-xl p-3 mb-3 border border-[#333]"
                                        onPress={() => (navigation as any).navigate('FoodItemDetails', { item })}
                                    >
                                        <Image
                                            source={{ uri: item.image }}
                                            className="w-20 h-20 rounded-lg"
                                        />
                                        <View className="flex-1 ml-3 justify-center">
                                            <Text className="text-white font-bold text-base mb-1">{item.name}</Text>
                                            <Text className="text-[#A0A0A0] text-sm mb-2">{item.restaurant}</Text>
                                            <View className="flex-row items-center justify-between">
                                                <Text className="text-[#1DB954] font-bold text-base">{item.price}</Text>
                                                <View className="flex-row items-center">
                                                    <Text className="text-[#FFD700] mr-1">★</Text>
                                                    <Text className="text-white text-sm">{item.rating}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Restaurants Section */}
                        {filteredRestaurants.length > 0 && (
                            <View className="px-4 py-4">
                                <Text className="text-white text-lg font-bold mb-4">
                                    Restaurants ({filteredRestaurants.length})
                                </Text>
                                {filteredRestaurants.map(restaurant => (
                                    <TouchableOpacity
                                        key={restaurant.id}
                                        className="bg-[#1E1E1E] rounded-xl overflow-hidden mb-3 border border-[#333]"
                                        onPress={() => (navigation as any).navigate('RestaurantDetails', { restaurantId: restaurant.id })}
                                    >
                                        <Image
                                            source={{ uri: restaurant.image }}
                                            className="w-full h-40"
                                        />
                                        <View className="p-3">
                                            <View className="flex-row justify-between items-start mb-2">
                                                <Text className="text-white font-bold text-base flex-1">{restaurant.name}</Text>
                                                {restaurant.offer && (
                                                    <View className="bg-[#1DB954] px-2 py-1 rounded">
                                                        <Text className="text-white text-xs font-bold">{restaurant.offer}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text className="text-[#A0A0A0] text-sm mb-2">{restaurant.cuisine}</Text>
                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center">
                                                    <Text className="text-[#FFD700] mr-1">★</Text>
                                                    <Text className="text-white text-sm">{restaurant.rating}</Text>
                                                </View>
                                                <Text className="text-[#A0A0A0] text-sm">🕒 {restaurant.time}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </>
                ) : (
                    // No Results State
                    <View className="flex-1 items-center justify-center px-4 py-20">
                        <Text className="text-6xl mb-4">🔍</Text>
                        <Text className="text-white text-xl font-bold mb-2">No Results Found</Text>
                        <Text className="text-[#A0A0A0] text-center mb-4">
                            We couldn't find anything matching "{query}"
                        </Text>
                        <Text className="text-[#666] text-sm text-center">
                            Try searching for different keywords or check spelling
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
