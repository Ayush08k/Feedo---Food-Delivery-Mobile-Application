import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, TextInput, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCart } from '../cart/CartContext';

const { width } = Dimensions.get('window');

interface FoodItem {
    id: number;
    name: string;
    restaurant: string;
    restaurantId?: number;
    price: string;
    rating: number;
    image: string;
    description?: string;
    category?: string;
}

interface Review {
    id: number;
    userName: string;
    userAvatar: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    helpful: number;
    images?: string[];
}

const MOCK_REVIEWS: Review[] = [
    {
        id: 1,
        userName: 'Sarah Johnson',
        userAvatar: '👩',
        rating: 5,
        date: '2 days ago',
        title: 'Absolutely Delicious!',
        comment: 'Best burger I\'ve had in ages! The patty was perfectly cooked, juicy, and the toppings were fresh. Delivery was quick too!',
        helpful: 24,
    },
    {
        id: 2,
        userName: 'Mike Chen',
        userAvatar: '👨',
        rating: 4,
        date: '5 days ago',
        title: 'Great taste, small portion',
        comment: 'Really enjoyed the flavors but wish the portion was a bit larger for the price. Would still order again though!',
        helpful: 12,
    },
    {
        id: 3,
        userName: 'Priya Sharma',
        userAvatar: '👩‍🦱',
        rating: 5,
        date: '1 week ago',
        title: 'Worth every penny!',
        comment: 'The quality is outstanding. Fresh ingredients, perfect seasoning, and excellent packaging. My new favorite!',
        helpful: 18,
    },
    {
        id: 4,
        userName: 'John Davis',
        userAvatar: '👨‍🦰',
        rating: 3,
        date: '1 week ago',
        title: 'Decent, but not amazing',
        comment: 'It\'s okay for the price. Nothing special but satisfies the craving. Service could be faster.',
        helpful: 5,
    },
];

const SIMILAR_ITEMS = [
    { id: 2, name: 'Cheese Burger', restaurant: 'Burger King', price: '$9.99', rating: 4.7, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80' },
    { id: 3, name: 'Veggie Burger', restaurant: 'Burger King', price: '$7.99', rating: 4.5, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80' },
    { id: 4, name: 'Double Patty', restaurant: 'Burger King', price: '$11.99', rating: 4.9, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80' },
];

const SIMILAR_RESTAURANTS = [
    { id: 2, name: 'Five Guys', rating: 4.8, time: '25-35 min', cuisine: 'Burgers', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&q=80' },
    { id: 3, name: 'Shake Shack', rating: 4.7, time: '20-30 min', cuisine: 'Fast Food', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&q=80' },
    { id: 4, name: 'In-N-Out', rating: 4.9, time: '15-25 min', cuisine: 'Burgers', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80' },
];

const ADDON_OPTIONS = [
    { id: 1, name: 'Extra Cheese', price: 1.5 },
    { id: 2, name: 'Bacon', price: 2.0 },
    { id: 3, name: 'Avocado', price: 2.5 },
    { id: 4, name: 'Extra Patty', price: 3.5 },
];

const SIZE_OPTIONS = [
    { id: 1, name: 'Regular', multiplier: 1 },
    { id: 2, name: 'Large', multiplier: 1.5 },
];

export default function FoodItemDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params as { item: FoodItem };
    const { items: cartItems, addToCart } = useCart();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
    const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isAdded, setIsAdded] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    // Reset state when item changes (when navigating to similar items)
    React.useEffect(() => {
        setQuantity(1);
        setSelectedSize(SIZE_OPTIONS[0]);
        setSelectedAddons([]);
        setShowAllReviews(false);
        setSpecialInstructions('');
    }, [item.id]);

    const basePrice = parseFloat(item.price.replace('$', ''));
    const sizePrice = basePrice * selectedSize.multiplier;
    const addonsPrice = selectedAddons.reduce((sum, addonId) => {
        const addon = ADDON_OPTIONS.find(a => a.id === addonId);
        return sum + (addon?.price || 0);
    }, 0);
    const totalPrice = (sizePrice + addonsPrice) * quantity;

    const averageRating = 4.5;
    const totalReviews = 128;
    const ratingDistribution = [
        { stars: 5, count: 89, percentage: 70 },
        { stars: 4, count: 25, percentage: 20 },
        { stars: 3, count: 10, percentage: 8 },
        { stars: 2, count: 3, percentage: 2 },
        { stars: 1, count: 1, percentage: 0 },
    ];

    const displayedReviews = showAllReviews ? MOCK_REVIEWS : MOCK_REVIEWS.slice(0, 2);

    const toggleAddon = (addonId: number) => {
        if (selectedAddons.includes(addonId)) {
            setSelectedAddons(selectedAddons.filter(id => id !== addonId));
        } else {
            setSelectedAddons([...selectedAddons, addonId]);
        }
    };

    const handleAddToCart = () => {
        const cartItem = {
            id: item.id,
            name: item.name,
            price: totalPrice / quantity,
            image: item.image,
            description: item.description || '',
        };

        // Add the item with the selected quantity
        for (let i = 0; i < quantity; i++) {
            addToCart(cartItem, item.restaurantId || 1);
        }

        // Trigger animation
        setIsAdded(true);
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1.1,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.8,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            setTimeout(() => {
                setIsAdded(false);
                setQuantity(1); // Reset counter to 1
            }, 1000);
        });
    };

    const renderStars = (rating: number) => {
        return (
            <View className="flex-row">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Text key={star} className={star <= rating ? 'text-[#FFD700]' : 'text-[#666]'}>
                        ★
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#121212]">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                {/* Hero Image Section */}
                <View className="relative">
                    <Image
                        source={{ uri: item.image }}
                        style={{ width: width, height: 350 }}
                        resizeMode="cover"
                    />
                    {/* Gradient Overlay */}
                    <View className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"
                        style={{ backgroundColor: 'rgba(18, 18, 18, 0.3)' }}
                    />

                    {/* Top Bar */}
                    <SafeAreaView className="absolute top-0 left-0 right-0">
                        <View className="flex-row justify-between items-center px-4 py-2">
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                className="w-12 h-12 bg-[#121212]/90 rounded-full items-center justify-center"
                                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }}
                            >
                                <Text className="text-white text-2xl font-bold">←</Text>
                            </TouchableOpacity>
                            <View className="flex-row">
                                <TouchableOpacity
                                    className="w-12 h-12 bg-[#121212]/90 rounded-full items-center justify-center mr-3"
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }}
                                >
                                    <Text className="text-white text-2xl">🤍</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="w-12 h-12 bg-[#121212]/90 rounded-full items-center justify-center"
                                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 }}
                                >
                                    <Text className="text-white text-2xl">↗</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>

                {/* Product Info Card */}
                <View className="px-4 py-4 bg-[#121212]">
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                            <Text className="text-white text-2xl font-bold mb-1">{item.name}</Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text className="text-[#1DB954] text-base">{item.restaurant}</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="bg-[#1E1E1E] px-3 py-2 rounded-xl border border-[#1DB954]">
                            <View className="flex-row items-center">
                                <Text className="text-[#FFD700] text-lg mr-1">★</Text>
                                <Text className="text-white font-bold">{averageRating}</Text>
                            </View>
                            <Text className="text-[#A0A0A0] text-xs">{totalReviews} reviews</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mb-3">
                        <Text className="text-[#1DB954] text-3xl font-bold">${totalPrice.toFixed(2)}</Text>
                        <Text className="text-[#A0A0A0] text-sm ml-3">🕒 20-30 min</Text>
                        <Text className="text-[#A0A0A0] text-sm ml-3">📍 2.5 km</Text>
                    </View>

                    <Text className="text-[#A0A0A0] text-sm leading-5">
                        {item.description || 'A delicious meal prepared with fresh ingredients and served hot. Perfect for any time of the day!'}
                    </Text>
                </View>

                {/* Size Selection */}
                <View className="px-4 py-4 bg-[#1E1E1E] mt-2">
                    <Text className="text-white text-lg font-bold mb-3">Choose Size</Text>
                    <View className="flex-row">
                        {SIZE_OPTIONS.map((size) => (
                            <TouchableOpacity
                                key={size.id}
                                onPress={() => setSelectedSize(size)}
                                className={`flex-1 mr-2 p-3 rounded-xl border ${selectedSize.id === size.id
                                    ? 'bg-[#1DB954]/20 border-[#1DB954]'
                                    : 'bg-[#121212] border-[#333]'
                                    }`}
                            >
                                <Text className={`text-center font-bold ${selectedSize.id === size.id ? 'text-[#1DB954]' : 'text-white'
                                    }`}>
                                    {size.name}
                                </Text>
                                {size.multiplier !== 1 && (
                                    <Text className="text-[#A0A0A0] text-xs text-center mt-1">
                                        +${((basePrice * size.multiplier) - basePrice).toFixed(2)}
                                    </Text>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Add-ons */}
                <View className="px-4 py-4 bg-[#1E1E1E] mt-2">
                    <Text className="text-white text-lg font-bold mb-3">Add-ons</Text>
                    {ADDON_OPTIONS.map((addon) => (
                        <TouchableOpacity
                            key={addon.id}
                            onPress={() => toggleAddon(addon.id)}
                            className="flex-row justify-between items-center mb-3 p-3 bg-[#121212] rounded-xl border border-[#333]"
                        >
                            <View className="flex-row items-center flex-1">
                                <View className={`w-5 h-5 rounded border-2 mr-3 items-center justify-center ${selectedAddons.includes(addon.id)
                                    ? 'bg-[#1DB954] border-[#1DB954]'
                                    : 'border-[#666]'
                                    }`}>
                                    {selectedAddons.includes(addon.id) && (
                                        <Text className="text-white text-xs">✓</Text>
                                    )}
                                </View>
                                <Text className="text-white">{addon.name}</Text>
                            </View>
                            <Text className="text-[#1DB954] font-bold">+${addon.price.toFixed(2)}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Special Instructions */}
                <View className="px-4 py-4 bg-[#1E1E1E] mt-2">
                    <Text className="text-white text-lg font-bold mb-3">Special Instructions</Text>
                    <TextInput
                        value={specialInstructions}
                        onChangeText={setSpecialInstructions}
                        placeholder="E.g., No onions, extra sauce..."
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={3}
                        className="bg-[#121212] text-white p-3 rounded-xl border border-[#333]"
                        style={{ textAlignVertical: 'top' }}
                    />
                </View>

                {/* Reviews Section */}
                <View className="px-4 py-4 bg-[#1E1E1E] mt-2">
                    <Text className="text-white text-xl font-bold mb-4">Reviews & Ratings</Text>

                    {/* Overall Rating */}
                    <View className="flex-row mb-4">
                        <View className="items-center mr-6">
                            <Text className="text-white text-5xl font-bold">{averageRating}</Text>
                            {renderStars(Math.round(averageRating))}
                            <Text className="text-[#A0A0A0] text-sm mt-1">{totalReviews} ratings</Text>
                        </View>

                        {/* Rating Distribution */}
                        <View className="flex-1">
                            {ratingDistribution.map((dist) => (
                                <View key={dist.stars} className="flex-row items-center mb-1">
                                    <Text className="text-[#A0A0A0] text-xs w-6">{dist.stars}★</Text>
                                    <View className="flex-1 h-2 bg-[#121212] rounded-full mx-2 overflow-hidden">
                                        <View
                                            className="h-full bg-[#1DB954]"
                                            style={{ width: `${dist.percentage}%` }}
                                        />
                                    </View>
                                    <Text className="text-[#A0A0A0] text-xs w-8">{dist.count}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Individual Reviews */}
                    {displayedReviews.map((review) => (
                        <View key={review.id} className="mb-4 p-4 bg-[#121212] rounded-xl">
                            <View className="flex-row items-start mb-2">
                                <View className="w-10 h-10 bg-[#1E1E1E] rounded-full items-center justify-center mr-3">
                                    <Text className="text-2xl">{review.userAvatar}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className="text-white font-bold">{review.userName}</Text>
                                    <Text className="text-[#A0A0A0] text-xs">{review.date}</Text>
                                </View>
                                <View className="flex-row items-center bg-[#1E1E1E] px-2 py-1 rounded-lg">
                                    <Text className="text-[#FFD700] mr-1">★</Text>
                                    <Text className="text-white text-sm">{review.rating}</Text>
                                </View>
                            </View>
                            <Text className="text-white font-bold mb-1">{review.title}</Text>
                            <Text className="text-[#A0A0A0] text-sm leading-5 mb-2">{review.comment}</Text>
                            <TouchableOpacity className="flex-row items-center">
                                <Text className="text-[#A0A0A0] text-xs mr-1">👍</Text>
                                <Text className="text-[#A0A0A0] text-xs">Helpful ({review.helpful})</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* View More Reviews Button */}
                    {!showAllReviews && MOCK_REVIEWS.length > 2 && (
                        <TouchableOpacity
                            onPress={() => setShowAllReviews(true)}
                            className="p-3 bg-[#121212] rounded-xl border border-[#1DB954]"
                        >
                            <Text className="text-[#1DB954] text-center font-bold">
                                View All {MOCK_REVIEWS.length} Reviews
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Similar Items */}
                <View className="py-4 bg-[#1E1E1E] mt-2">
                    <Text className="text-white text-xl font-bold px-4 mb-4">Similar Items</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {SIMILAR_ITEMS.map((similarItem) => (
                            <TouchableOpacity
                                key={similarItem.id}
                                className="mr-4 bg-[#121212] rounded-2xl overflow-hidden border border-[#333] w-40"
                                onPress={() => (navigation as any).push('FoodItemDetails', { item: similarItem })}
                            >
                                <Image source={{ uri: similarItem.image }} className="w-full h-32" resizeMode="cover" />
                                <View className="p-3">
                                    <Text className="text-white font-bold text-sm mb-1" numberOfLines={1}>
                                        {similarItem.name}
                                    </Text>
                                    <Text className="text-[#666] text-xs mb-2" numberOfLines={1}>
                                        {similarItem.restaurant}
                                    </Text>
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-[#1DB954] font-bold">{similarItem.price}</Text>
                                        <View className="flex-row items-center">
                                            <Text className="text-[#FFD700] text-xs mr-1">★</Text>
                                            <Text className="text-white text-xs">{similarItem.rating}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Similar Restaurants */}
                <View className="py-4 bg-[#1E1E1E] mt-2 mb-24">
                    <Text className="text-white text-xl font-bold px-4 mb-4">Similar Restaurants</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                        {SIMILAR_RESTAURANTS.map((restaurant) => (
                            <TouchableOpacity
                                key={restaurant.id}
                                className="mr-4 bg-[#121212] rounded-2xl overflow-hidden border border-[#333] w-56"
                                onPress={() => (navigation as any).navigate('RestaurantDetails', { restaurant })}
                            >
                                <Image source={{ uri: restaurant.image }} className="w-full h-32" resizeMode="cover" />
                                <View className="p-3">
                                    <Text className="text-white font-bold text-base mb-1">{restaurant.name}</Text>
                                    <Text className="text-[#666] text-xs mb-2">{restaurant.cuisine}</Text>
                                    <View className="flex-row justify-between items-center">
                                        <View className="flex-row items-center">
                                            <Text className="text-[#FFD700] mr-1">★</Text>
                                            <Text className="text-white text-sm">{restaurant.rating}</Text>
                                        </View>
                                        <Text className="text-[#A0A0A0] text-xs">🕒 {restaurant.time}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Sticky Bottom Cart Bar - Dark Single Row Design */}
            <View className="absolute bottom-0 left-0 right-0 bg-[#121212] border-t border-[#333]">
                <SafeAreaView edges={['bottom']}>
                    <View className="flex-row items-center px-4 py-2">
                        {/* Decrease Button (10%) */}
                        <TouchableOpacity
                            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                            style={{ width: '10%' }}
                            className="bg-[#1E1E1E] py-2 items-center justify-center"
                        >
                            <Text className="text-white text-2xl font-bold">−</Text>
                        </TouchableOpacity>
                        {/* Quantity Display (5%) */}
                        <View style={{ width: '5%' }} className="bg-[#1E1E1E] py-2 items-center justify-center">
                            <Text className="text-[#1DB954] text-lg font-bold">{quantity}</Text>
                        </View>
                        {/* Increase Button (10%) */}
                        <TouchableOpacity
                            onPress={() => setQuantity(quantity + 1)}
                            style={{ width: '10%' }}
                            className="bg-[#1E1E1E] py-2 items-center justify-center"
                        >
                            <Text className="text-white text-2xl font-bold">+</Text>
                        </TouchableOpacity>
                        {/* Add to Cart (45%) */}
                        <Animated.View
                            style={{
                                width: '45%',
                                transform: [{ scale: scaleAnim }],
                                opacity: opacityAnim,
                            }}
                        >
                            <TouchableOpacity
                                className="bg-[#1DB954] rounded-lg mx-2 py-2 items-center justify-center"
                                onPress={handleAddToCart}
                            >
                                <Text className="text-white font-bold text-base">
                                    {isAdded ? '✓ Added to Cart!' : `ADD ${quantity} • $${totalPrice.toFixed(2)}`}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                        {/* Checkout (30%) */}
                        <TouchableOpacity
                            style={{ width: '30%' }}
                            className="bg-[#FFD93D] rounded-lg py-2 items-center justify-center relative"
                            onPress={() => (navigation as any).navigate('Checkout')}
                        >
                            <Text className="text-[#121212] font-bold text-base">CHECKOUT</Text>
                            {cartItems.length > 0 && (
                                <View className="absolute -top-2 -right-2 bg-[#121212] rounded-full w-5 h-5 flex items-center justify-center">
                                    <Text className="text-white text-xs font-bold">
                                        {cartItems.reduce((sum, i) => sum + i.quantity, 0)}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </View>
    );
}
