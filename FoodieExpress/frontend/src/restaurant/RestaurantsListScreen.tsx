import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { fetchAllRestaurants, Restaurant } from '../utils/restaurantApi';

export default function RestaurantsListScreen() {
    const navigation = useNavigation<any>();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sortOrder, setSortOrder] = useState<'high' | 'low'>('high');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchAllRestaurants('rating');
            setRestaurants(data);
        } catch (err) {
            console.error('Failed to load restaurants:', err);
            setError('Failed to load restaurants. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadRestaurants();
        setRefreshing(false);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'high' ? 'low' : 'high');
        setRestaurants(prev => [...prev].reverse());
    };

    const getDefaultImage = () => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center">
                <ActivityIndicator size="large" color="#1DB954" />
                <Text className="text-[#A0A0A0] mt-4">Loading restaurants...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] justify-center items-center px-4">
                <Text className="text-red-500 text-xl mb-4">⚠️ {error}</Text>
                <TouchableOpacity
                    onPress={loadRestaurants}
                    className="bg-[#1DB954] px-6 py-3 rounded-full"
                >
                    <Text className="text-black font-bold">Try Again</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 border-b border-[#333] flex-row justify-between items-center">
                <View className="flex-1">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text className="text-[#1DB954] text-2xl">←</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-white text-xl font-bold flex-1 text-center">All Restaurants</Text>
                <View className="flex-1" />
            </View>

            {/* Sort Controls */}
            <View className="px-4 py-3 bg-[#1E1E1E] border-b border-[#333] flex-row justify-between items-center">
                <Text className="text-[#A0A0A0] text-sm">
                    {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''} found
                </Text>
                <TouchableOpacity
                    onPress={toggleSortOrder}
                    className="flex-row items-center bg-[#121212] px-4 py-2 rounded-full border border-[#1DB954]"
                >
                    <Text className="text-[#1DB954] font-bold text-sm mr-2">
                        {sortOrder === 'high' ? '★ High to Low' : '★ Low to High'}
                    </Text>
                    <Text className="text-[#1DB954]">⇅</Text>
                </TouchableOpacity>
            </View>

            {/* Restaurants List */}
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#1DB954"
                        colors={['#1DB954']}
                    />
                }
            >
                {restaurants.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <Text className="text-[#A0A0A0] text-xl mb-2">🏪</Text>
                        <Text className="text-[#A0A0A0] text-lg">No restaurants available</Text>
                        <Text className="text-[#666] text-sm mt-2">Pull down to refresh</Text>
                    </View>
                ) : (
                    <View className="px-4 pt-4 pb-20">
                        {restaurants.map((restaurant, index) => (
                            <TouchableOpacity
                                key={restaurant._id || index}
                                className="mb-6 bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#333]"
                                onPress={() => navigation.navigate('RestaurantDetails', { restaurant })}
                            >
                                <Image
                                    source={{ uri: restaurant.imageUrl || getDefaultImage() }}
                                    className="w-full h-48"
                                    resizeMode="cover"
                                />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-start mb-2">
                                        <View className="flex-1 mr-2">
                                            <Text className="text-white text-lg font-bold" numberOfLines={1}>
                                                {restaurant.name}
                                            </Text>
                                            {restaurant.cuisineType && (
                                                <Text className="text-[#666] text-sm mt-1">
                                                    🍽️ {restaurant.cuisineType}
                                                </Text>
                                            )}
                                        </View>
                                        <View className="flex-row items-center bg-[#121212] px-3 py-2 rounded-lg">
                                            <Text className="text-[#1DB954] font-bold mr-1">★</Text>
                                            <Text className="text-white font-bold">
                                                {restaurant.rating ? restaurant.rating.toFixed(1) : '0.0'}
                                            </Text>
                                        </View>
                                    </View>

                                    {restaurant.description && (
                                        <Text className="text-[#A0A0A0] text-sm mb-2" numberOfLines={2}>
                                            {restaurant.description}
                                        </Text>
                                    )}

                                    <View className="flex-row items-center justify-between mt-2">
                                        <View className="flex-row items-center">
                                            {restaurant.isOpen !== false ? (
                                                <View className="flex-row items-center">
                                                    <View className="w-2 h-2 bg-[#1DB954] rounded-full mr-2" />
                                                    <Text className="text-[#1DB954] text-xs">Open Now</Text>
                                                </View>
                                            ) : (
                                                <View className="flex-row items-center">
                                                    <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                                    <Text className="text-red-500 text-xs">Closed</Text>
                                                </View>
                                            )}
                                        </View>

                                        {restaurant.openingTime && restaurant.closingTime && (
                                            <Text className="text-[#666] text-xs">
                                                🕒 {restaurant.openingTime} - {restaurant.closingTime}
                                            </Text>
                                        )}
                                    </View>

                                    {restaurant.address && (
                                        <Text className="text-[#666] text-xs mt-2" numberOfLines={1}>
                                            📍 {restaurant.address}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
