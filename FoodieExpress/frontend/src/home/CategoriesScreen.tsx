import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const CATEGORIES = [
    { id: 1, name: 'Biryani', icon: '🍛', description: 'Aromatic rice dishes' },
    { id: 2, name: 'Curries', icon: '🍲', description: 'Rich & flavorful' },
    { id: 3, name: 'Veg', icon: '🥗', description: 'Vegetarian delights' },
    { id: 4, name: 'Non-Veg', icon: '🍗', description: 'Meat specialties' },
    { id: 5, name: 'Dosa', icon: '🥞', description: 'Crispy & delicious' },
    { id: 6, name: 'Idli', icon: '⚪', description: 'Soft steamed cakes' },
    { id: 7, name: 'South Indian', icon: '🌶️', description: 'Spicy favorites' },
    { id: 8, name: 'North Indian', icon: '🫓', description: 'Traditional recipes' },
    { id: 9, name: 'Tea & Coffee', icon: '☕', description: 'Hot beverages' },
    { id: 10, name: 'Ice Cream', icon: '🍦', description: 'Cool treats' },
    { id: 11, name: 'Desserts', icon: '🍰', description: 'Sweet endings' },
    { id: 12, name: 'Juice', icon: '🧃', description: 'Fresh & healthy' },
    { id: 13, name: 'Momos', icon: '🥟', description: 'Steamed dumplings' },
    { id: 14, name: 'Pav Bhaji', icon: '🍞', description: 'Street food classic' },
    { id: 15, name: 'Vada Pav', icon: '🥖', description: 'Mumbai special' },
    { id: 16, name: 'Chole Bhature', icon: '🫔', description: 'Punjabi delight' },
    { id: 17, name: 'Pizza', icon: '🍕', description: 'Italian favorite' },
    { id: 18, name: 'Burger', icon: '🍔', description: 'Juicy & tasty' },
    { id: 19, name: 'Sushi', icon: '🍣', description: 'Japanese cuisine' },
    { id: 20, name: 'Asian', icon: '🍜', description: 'Oriental flavors' },
];

export default function CategoriesScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-6 py-5 border-b border-[#333]">
                <View className="flex-row items-center mb-2">
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4 bg-[#1E1E1E] p-2 rounded-full">
                        <Text className="text-white text-xl">←</Text>
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white text-2xl font-bold">All Categories</Text>
                        <Text className="text-[#666] text-sm">Explore what you crave</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
                <View className="flex-row flex-wrap justify-between">
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            className="w-[48%] mb-4 bg-[#1E1E1E] rounded-2xl p-4 border border-[#333] active:border-[#1DB954]"
                            activeOpacity={0.7}
                        >
                            <View className="items-center mb-3">
                                <View className="w-16 h-16 bg-[#121212] rounded-2xl items-center justify-center mb-2 border border-[#333]">
                                    <Text className="text-4xl">{cat.icon}</Text>
                                </View>
                            </View>
                            <View>
                                <Text className="text-white text-base font-bold text-center mb-1">{cat.name}</Text>
                                <Text className="text-[#666] text-xs text-center">{cat.description}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom spacing */}
                <View className="h-6" />
            </ScrollView>
        </SafeAreaView>
    );
}
