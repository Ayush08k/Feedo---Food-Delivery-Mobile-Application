import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const ALL_OFFERS = [
    { id: 1, title: '50% OFF', description: 'On orders above $20', color: '#FF6B6B', discountPercentage: 50, applicableItemIds: [1, 2, 4], minOrder: 20 },
    { id: 2, title: 'Free Delivery', description: 'First order special', color: '#1DB954', discountPercentage: 0, applicableItemIds: [1, 3], minOrder: 0 },
    { id: 3, title: 'Buy 1 Get 1', description: 'Selected items only', color: '#FFD93D', discountPercentage: 50, applicableItemIds: [2, 3, 4], minOrder: 0 },
    { id: 4, title: '40% OFF', description: 'On all burgers', color: '#FF6B6B', discountPercentage: 40, applicableItemIds: [1, 5], minOrder: 15 },
    { id: 5, title: '60% OFF', description: 'Weekend special', color: '#FF6B6B', discountPercentage: 60, applicableItemIds: [1, 2, 3, 4], minOrder: 25 },
    { id: 6, title: '30% OFF', description: 'New user offer', color: '#FF6B6B', discountPercentage: 30, applicableItemIds: [1, 2], minOrder: 10 },
    { id: 7, title: 'Flat $5 OFF', description: 'No minimum order', color: '#1DB954', discountPercentage: 0, applicableItemIds: [1, 2, 3, 4], minOrder: 0 },
];

export default function BestOffersScreen() {
    const navigation = useNavigation<any>();
    const [sortOrder, setSortOrder] = useState<'high' | 'low'>('high');

    const sortedOffers = [...ALL_OFFERS].sort((a, b) => {
        if (sortOrder === 'high') {
            return b.discountPercentage - a.discountPercentage;
        } else {
            return a.discountPercentage - b.discountPercentage;
        }
    });

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'high' ? 'low' : 'high');
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 border-b border-[#333] flex-row justify-between items-center">
                <View className="flex-1">
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text className="text-[#1DB954] text-2xl">←</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-white text-xl font-bold flex-1 text-center">Best Offers</Text>
                <View className="flex-1" />
            </View>

            {/* Sort Controls */}
            <View className="px-4 py-3 bg-[#1E1E1E] border-b border-[#333] flex-row justify-between items-center">
                <Text className="text-[#A0A0A0] text-sm">
                    {sortedOffers.length} offer{sortedOffers.length !== 1 ? 's' : ''} available
                </Text>
                <TouchableOpacity
                    onPress={toggleSortOrder}
                    className="flex-row items-center bg-[#121212] px-4 py-2 rounded-full border border-[#1DB954]"
                >
                    <Text className="text-[#1DB954] font-bold text-sm mr-2">
                        {sortOrder === 'high' ? '% High to Low' : '% Low to High'}
                    </Text>
                    <Text className="text-[#1DB954]">⇅</Text>
                </TouchableOpacity>
            </View>

            {/* Offers List */}
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-4 pt-4 pb-20">
                    {sortedOffers.map((offer) => (
                        <TouchableOpacity
                            key={offer.id}
                            className="mb-4 p-6 rounded-2xl"
                            style={{ backgroundColor: offer.color + '20', borderColor: offer.color, borderWidth: 2 }}
                            onPress={() => navigation.navigate('OfferDetails', { offer })}
                        >
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-3xl font-bold mb-2" style={{ color: offer.color }}>
                                        {offer.title}
                                    </Text>
                                    <Text className="text-white text-base mb-3">
                                        {offer.description}
                                    </Text>
                                </View>
                                {offer.discountPercentage > 0 && (
                                    <View className="bg-white px-3 py-2 rounded-full">
                                        <Text className="font-bold" style={{ color: offer.color }}>
                                            {offer.discountPercentage}%
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {offer.minOrder > 0 && (
                                <View className="flex-row items-center mt-2">
                                    <Text className="text-[#A0A0A0] text-sm">
                                        💰 Min. order: ${offer.minOrder}
                                    </Text>
                                </View>
                            )}

                            <View className="mt-4 pt-4 border-t" style={{ borderTopColor: offer.color + '40' }}>
                                <Text className="text-white text-xs">
                                    Applicable on {offer.applicableItemIds.length} item(s)
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
