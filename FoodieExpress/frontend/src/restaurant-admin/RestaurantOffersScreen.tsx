import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import OfferCard from '../utils/OfferCard';
import { useAlert } from '../utils/AlertContext';

interface Offer {
    id: number;
    title: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrder?: number;
    validUntil: string;
    color: string;
    active: boolean;
    redemptions: number;
}

export default function RestaurantOffersScreen() {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [offers, setOffers] = useState<Offer[]>([
        {
            id: 1,
            title: '30% OFF',
            description: 'Happy Hour Special',
            discountType: 'percentage',
            discountValue: 30,
            minOrder: 20,
            validUntil: '2026-02-15',
            color: '#FF6B6B',
            active: true,
            redemptions: 45
        },
        {
            id: 2,
            title: 'Free Delivery',
            description: 'Orders above $20',
            discountType: 'fixed',
            discountValue: 5,
            minOrder: 20,
            validUntil: '2026-02-28',
            color: '#1DB954',
            active: true,
            redemptions: 78
        },
        {
            id: 3,
            title: 'Buy 1 Get 1',
            description: 'On selected items',
            discountType: 'percentage',
            discountValue: 50,
            validUntil: '2026-02-10',
            color: '#FFD93D',
            active: false,
            redemptions: 23
        },
    ]);

    const toggleOfferStatus = (id: number) => {
        setOffers(offers =>
            offers.map(offer =>
                offer.id === id ? { ...offer, active: !offer.active } : offer
            )
        );
    };

    const deleteOffer = (id: number) => {
        showAlert(
            'Delete Offer',
            'Are you sure you want to delete this offer?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setOffers(offers => offers.filter(offer => offer.id !== id))
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="mr-4 p-2 rounded-full bg-[#1E1E1E]"
                        >
                            <Text className="text-white">←</Text>
                        </TouchableOpacity>
                        <View>
                            <Text className="text-white text-2xl font-bold">Offers & Promotions</Text>
                            <Text className="text-[#A0A0A0] text-sm">{offers.filter(o => o.active).length} active offers</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="bg-[#1DB954] px-4 py-2 rounded-full"
                        onPress={() => setShowCreateModal(true)}
                    >
                        <Text className="text-black font-bold">+ Create</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Analytics Cards */}
            <View className="px-4 py-4">
                <View className="flex-row space-x-4">
                    <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Total Redemptions</Text>
                        <Text className="text-white text-2xl font-bold mt-1">
                            {offers.reduce((sum, o) => sum + o.redemptions, 0)}
                        </Text>
                    </View>
                    <View className="flex-1 bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Revenue Impact</Text>
                        <Text className="text-[#1DB954] text-2xl font-bold mt-1">+$2,340</Text>
                    </View>
                </View>
            </View>

            {/* Active Offers Preview */}
            <View className="mb-4">
                <Text className="text-white text-xl font-bold px-4 mb-4">Active Offers Preview</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {offers.filter(o => o.active).map((offer) => (
                        <OfferCard
                            key={offer.id}
                            title={offer.title}
                            description={offer.description}
                            color={offer.color}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* All Offers List */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <Text className="text-white text-xl font-bold mb-4">All Offers</Text>
                {offers.map((offer) => (
                    <View key={offer.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="flex-1">
                                <View className="flex-row items-center mb-2">
                                    <Text className="text-2xl font-bold mr-2" style={{ color: offer.color }}>
                                        {offer.title}
                                    </Text>
                                    <View className={`px-2 py-1 rounded-full ${offer.active ? 'bg-[#1DB95420] border border-[#1DB954]' : 'bg-[#66666620] border border-[#666]'}`}>
                                        <Text className={`text-xs font-bold ${offer.active ? 'text-[#1DB954]' : 'text-[#666]'}`}>
                                            {offer.active ? 'Active' : 'Inactive'}
                                        </Text>
                                    </View>
                                </View>
                                <Text className="text-white mb-1">{offer.description}</Text>
                                <Text className="text-[#A0A0A0] text-xs">
                                    {offer.discountType === 'percentage' ? `${offer.discountValue}% discount` : `$${offer.discountValue} off`}
                                    {offer.minOrder && ` • Min order: $${offer.minOrder}`}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between items-center pt-3 border-t border-[#333]">
                            <View>
                                <Text className="text-[#666] text-xs">Redemptions</Text>
                                <Text className="text-white font-bold">{offer.redemptions}</Text>
                            </View>
                            <View>
                                <Text className="text-[#666] text-xs">Valid Until</Text>
                                <Text className="text-white font-bold">{offer.validUntil}</Text>
                            </View>
                            <View className="flex-row space-x-2">
                                <TouchableOpacity
                                    className="bg-[#1E1E1E] border border-[#1DB954] px-3 py-2 rounded-lg"
                                    onPress={() => toggleOfferStatus(offer.id)}
                                >
                                    <Text className="text-[#1DB954] text-xs font-bold">
                                        {offer.active ? 'Deactivate' : 'Activate'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-[#1E1E1E] border border-[#FF6B6B] px-3 py-2 rounded-lg"
                                    onPress={() => deleteOffer(offer.id)}
                                >
                                    <Text className="text-[#FF6B6B] text-xs font-bold">Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
