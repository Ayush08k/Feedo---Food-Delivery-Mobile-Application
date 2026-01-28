import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, Image, TouchableOpacity, BackHandler, Keyboard, TouchableWithoutFeedback, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { getSuggestions } from '../utils/searchUtils';
import { getSearchHistory, saveSearchQuery, clearSearchHistory } from '../utils/searchHistoryUtils';

const CATEGORIES = [
    { id: 1, name: 'Biryani', icon: '🍛' },
    { id: 2, name: 'Curries', icon: '🍲' },
    { id: 3, name: 'Veg', icon: '🥗' },
    { id: 4, name: 'Non-Veg', icon: '🍗' },
    { id: 5, name: 'Dosa', icon: '🥞' },
    { id: 6, name: 'Idli', icon: '⚪' },
    { id: 7, name: 'South Indian', icon: '🌶️' },
    { id: 8, name: 'North Indian', icon: '🫓' },
    { id: 9, name: 'Tea & Coffee', icon: '☕' },
    { id: 10, name: 'Ice Cream', icon: '🍦' },
    { id: 11, name: 'Desserts', icon: '🍰' },
    { id: 12, name: 'Juice', icon: '🧃' },
    { id: 13, name: 'Momos', icon: '🥟' },
    { id: 14, name: 'Pav Bhaji', icon: '🍞' },
    { id: 15, name: 'Vada Pav', icon: '🥖' },
    { id: 16, name: 'Chole Bhature', icon: '🫔' },
    { id: 17, name: 'Pizza', icon: '🍕' },
    { id: 18, name: 'Burger', icon: '🍔' },
    { id: 19, name: 'Sushi', icon: '🍣' },
    { id: 20, name: 'Asian', icon: '🍜' },
];

const OFFERS = [
    { id: 1, title: '50% OFF', description: 'On orders above $20', color: '#FF6B6B', discountPercentage: 50, applicableItemIds: [1, 2, 4] },
    { id: 2, title: 'Free Delivery', description: 'First order special', color: '#1DB954', applicableItemIds: [1, 3] },
    { id: 3, title: 'Buy 1 Get 1', description: 'Selected items only', color: '#FFD93D', applicableItemIds: [2, 3, 4] },
];

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

export default function HomeScreen() {
    const navigation = useNavigation();
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const searchInputRef = useRef<TextInput>(null);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    const displayedCategories = showAllCategories ? CATEGORIES : CATEGORIES.slice(0, 7);

    // Load search history on mount
    useEffect(() => {
        loadSearchHistory();
    }, []);

    // Animate dropdown when showSuggestions changes
    useEffect(() => {
        if (showSuggestions) {
            setShouldRender(true);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 10,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Unmount after animation completes
                setShouldRender(false);
            });
        }
    }, [showSuggestions]);

    // Handle Android back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (showSuggestions) {
                dismissSearch();
                return true; // Prevent default back behavior
            }
            return false; // Let default back behavior happen
        });

        return () => backHandler.remove();
    }, [showSuggestions]);

    const loadSearchHistory = async () => {
        const history = await getSearchHistory();
        setSearchHistory(history);
    };

    const dismissSearch = () => {
        setShowSuggestions(false);
        setIsSearchFocused(false);
        setSearchQuery('');
        searchInputRef.current?.blur();
        Keyboard.dismiss();
    };

    // Get search suggestions
    const suggestions = useMemo(() => {
        return getSuggestions(TOP_SELLERS, RESTAURANTS, searchQuery, 5);
    }, [searchQuery]);

    const handleSearch = async () => {
        if (searchQuery.trim().length >= 2) {
            await saveSearchQuery(searchQuery);
            await loadSearchHistory();
            setShowSuggestions(false);
            (navigation as any).navigate('SearchResults', { query: searchQuery });
        }
    };

    const handleClearHistory = async () => {
        await clearSearchHistory();
        setSearchHistory([]);
    };

    return (
        <TouchableWithoutFeedback onPress={dismissSearch}>
            <SafeAreaView className="flex-1 bg-[#121212]">
                {/* Header */}
                <View className="px-4 py-4 bg-[#121212] border-b border-[#333] relative">
                    <View className="flex-row justify-between items-center">
                        <Image
                            source={require('../../assets/logo.png')}
                            style={{ width: '30%', height: 44 }}
                            resizeMode="contain"
                        />
                        <TouchableOpacity className="bg-[#1E1E1E] p-2 rounded-full">
                            <Text>👤</Text>
                        </TouchableOpacity>
                    </View>
                    <View className="absolute left-0 right-0 items-center" style={{ top: 13, marginLeft: 40 }}>
                        <Text className="text-[#A0A0A0] text-sm uppercase">Deliver to</Text>
                        <Text className="text-[#1DB954] font-bold text-lg">Current Location 📍</Text>
                    </View>
                </View>

                {/* Search Bar */}
                <View className="px-4 py-4 relative z-10">
                    <View
                        className="bg-[#1E1E1E] flex-row items-center p-3 rounded-xl"
                        style={{
                            borderWidth: 2,
                            borderColor: isSearchFocused ? '#1DB954' : '#333',
                            transition: 'border-color 0.3s ease'
                        }}
                    >
                        <Text className="mr-2">🔍</Text>
                        <TextInput
                            ref={searchInputRef}
                            placeholder="Search for food or restaurants..."
                            placeholderTextColor="#666"
                            className="flex-1 text-white"
                            value={searchQuery}
                            onChangeText={(text) => {
                                setSearchQuery(text);
                                setShowSuggestions(true);
                            }}
                            onFocus={() => {
                                setIsSearchFocused(true);
                                setShowSuggestions(true);
                            }}
                            onBlur={() => {
                                setIsSearchFocused(false);
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>

                    {/* Autocomplete Suggestions & Recent Searches Dropdown */}
                    {shouldRender && (
                        <Animated.View
                            className="absolute top-20 left-4 right-4 bg-[#1E1E1E] rounded-xl border border-[#333] overflow-hidden shadow-lg"
                            style={{
                                zIndex: 1000,
                                opacity: opacityAnim,
                                transform: [
                                    {
                                        translateY: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-20, 0],
                                        }),
                                    },
                                    {
                                        scale: slideAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.95, 1],
                                        }),
                                    },
                                ],
                            }}
                        >
                            {searchQuery.length >= 2 && suggestions.length > 0 ? (
                                // Show autocomplete suggestions when typing
                                <>
                                    {suggestions.map((suggestion, index) => (
                                        <TouchableOpacity
                                            key={`${suggestion.type}-${suggestion.id}`}
                                            className={`flex-row items-center p-3 ${index !== suggestions.length - 1 ? 'border-b border-[#333]' : ''}`}
                                            onPress={async () => {
                                                setSearchQuery(suggestion.name);
                                                await saveSearchQuery(suggestion.name);
                                                await loadSearchHistory();
                                                setShowSuggestions(false);
                                                (navigation as any).navigate('SearchResults', { query: suggestion.name });
                                            }}
                                        >
                                            <Text className="mr-3 text-lg">{suggestion.type === 'food' ? '🍔' : '🏪'}</Text>
                                            <View className="flex-1">
                                                <Text className="text-white font-semibold">{suggestion.name}</Text>
                                                <Text className="text-[#A0A0A0] text-xs">
                                                    {suggestion.type === 'food' ? suggestion.restaurant : suggestion.cuisine}
                                                </Text>
                                            </View>
                                            <Text className="text-[#666] text-xs uppercase">{suggestion.type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) : searchHistory.length > 0 ? (
                                // Show recent searches when not typing
                                <>
                                    <View className="flex-row items-center justify-between p-3 border-b border-[#333]">
                                        <Text className="text-[#A0A0A0] text-sm font-semibold">Recent Searches</Text>
                                        <TouchableOpacity onPress={handleClearHistory}>
                                            <Text className="text-[#FF6B6B] text-xs">Clear All</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {searchHistory.map((historyItem, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className={`flex-row items-center p-3 ${index !== searchHistory.length - 1 ? 'border-b border-[#333]' : ''}`}
                                            onPress={() => {
                                                setSearchQuery(historyItem);
                                                setShowSuggestions(false);
                                                (navigation as any).navigate('SearchResults', { query: historyItem });
                                            }}
                                        >
                                            <Text className="mr-3 text-lg">🕒</Text>
                                            <Text className="flex-1 text-white">{historyItem}</Text>
                                            <Text className="text-[#666]">→</Text>
                                        </TouchableOpacity>
                                    ))}
                                </>
                            ) : null}
                        </Animated.View>
                    )}
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Offers Banner */}
                    <View className="mb-6">
                        <Text className="text-white text-xl font-bold px-4 mb-4">Offers For You</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {OFFERS.map((offer) => (
                                <TouchableOpacity
                                    key={offer.id}
                                    className="mr-4 p-6 rounded-2xl w-64"
                                    style={{ backgroundColor: offer.color + '20', borderColor: offer.color, borderWidth: 1 }}
                                    onPress={() => (navigation as any).navigate('OfferDetails', { offer })}
                                >
                                    <Text className="text-2xl font-bold mb-2" style={{ color: offer.color }}>{offer.title}</Text>
                                    <Text className="text-white">{offer.description}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Categories */}
                    <View className="mb-6">
                        <Text className="text-white text-xl font-bold px-4 mb-4">Categories</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {displayedCategories.map((cat) => (
                                <TouchableOpacity key={cat.id} className="mr-4 items-center">
                                    <View className="w-16 h-16 bg-[#1E1E1E] rounded-full items-center justify-center mb-2 border border-[#333]">
                                        <Text className="text-2xl">{cat.icon}</Text>
                                    </View>
                                    <Text className="text-[#A0A0A0] text-sm">{cat.name}</Text>
                                </TouchableOpacity>
                            ))}
                            {!showAllCategories && (
                                <TouchableOpacity
                                    onPress={() => (navigation as any).navigate('Categories')}
                                    className="mr-4 items-center"
                                >
                                    <View className="w-16 h-16 bg-[#1E1E1E] rounded-full items-center justify-center mb-2 border border-[#1DB954]">
                                        <Text className="text-2xl">⋯</Text>
                                    </View>
                                    <Text className="text-[#1DB954] text-sm font-bold">Show More</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>

                    {/* Top Sellers */}
                    <View className="mb-6">
                        <Text className="text-white text-xl font-bold px-4 mb-4">Top Sellers</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                            {TOP_SELLERS.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    className="mr-4 bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#333] w-44"
                                    onPress={() => (navigation as any).navigate('FoodItemDetails', { item })}
                                >
                                    <Image source={{ uri: item.image }} className="w-full h-32" resizeMode="cover" />
                                    <View className="p-3">
                                        <Text className="text-white font-bold text-base mb-1">{item.name}</Text>
                                        <Text className="text-[#666] text-xs mb-2">{item.restaurant}</Text>
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-[#1DB954] font-bold">{item.price}</Text>
                                            <View className="flex-row items-center bg-[#121212] px-2 py-1 rounded-lg">
                                                <Text className="text-[#1DB954] font-bold text-xs mr-1">★</Text>
                                                <Text className="text-white text-xs">{item.rating}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Best Offers */}
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center px-4 mb-4">
                            <Text className="text-white text-xl font-bold">Best Offers</Text>
                            <TouchableOpacity>
                                <Text className="text-[#1DB954]">See All →</Text>
                            </TouchableOpacity>
                        </View>
                        {RESTAURANTS.slice(0, 2).map((rest) => (
                            <TouchableOpacity
                                key={rest.id}
                                className="mx-4 mb-4 bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#333]"
                                onPress={() => (navigation as any).navigate('RestaurantDetails', { restaurant: rest })}
                            >
                                <View className="relative">
                                    <Image source={{ uri: rest.image }} className="w-full h-40" resizeMode="cover" />
                                    <View className="absolute top-2 left-2 bg-[#1DB954] px-3 py-1 rounded-full">
                                        <Text className="text-black font-bold text-xs">{rest.offer}</Text>
                                    </View>
                                </View>
                                <View className="p-4">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-white text-lg font-bold">{rest.name}</Text>
                                        <View className="flex-row items-center bg-[#121212] px-2 py-1 rounded-lg">
                                            <Text className="text-[#1DB954] font-bold mr-1">★</Text>
                                            <Text className="text-white text-xs">{rest.rating}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-[#A0A0A0] text-sm">🕒 {rest.time} • Free Delivery</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Popular Restaurants */}
                    <View className="px-4 pb-20">
                        <Text className="text-white text-xl font-bold mb-4">Popular Restaurants</Text>
                        {RESTAURANTS.map((rest) => (
                            <TouchableOpacity
                                key={rest.id}
                                className="mb-6 bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-lg border border-[#333]"
                                onPress={() => (navigation as any).navigate('RestaurantDetails', { restaurant: rest })}
                            >
                                <Image source={{ uri: rest.image }} className="w-full h-48" resizeMode="cover" />
                                <View className="p-4">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-white text-lg font-bold">{rest.name}</Text>
                                        <View className="flex-row items-center bg-[#121212] px-2 py-1 rounded-lg">
                                            <Text className="text-[#1DB954] font-bold mr-1">★</Text>
                                            <Text className="text-white text-xs">{rest.rating}</Text>
                                        </View>
                                    </View>
                                    <Text className="text-[#A0A0A0] text-sm">🕒 {rest.time} • Free Delivery</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
