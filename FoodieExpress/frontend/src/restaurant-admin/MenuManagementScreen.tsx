import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBarComponent from '../utils/SearchBarComponent';

interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
}

export default function MenuManagementScreen() {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Burgers', 'Pizza', 'Sides', 'Drinks', 'Desserts'];

    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        { id: 1, name: 'Double Cheeseburger', description: 'Two beef patties, cheddar, lettuce', price: 14, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true },
        { id: 2, name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, tomato', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80', available: true },
        { id: 3, name: 'Truffle Fries', description: 'Crispy fries with truffle oil', price: 8, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496987-a2267f70b77b?w=400&q=80', available: true },
        { id: 4, name: 'Classic Milkshake', description: 'Vanilla bean milkshake', price: 6, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', available: false },
    ]);

    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const toggleAvailability = (id: number) => {
        setMenuItems(items =>
            items.map(item =>
                item.id === id ? { ...item, available: !item.available } : item
            )
        );
    };

    const deleteItem = (id: number) => {
        Alert.alert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setMenuItems(items => items.filter(item => item.id !== id))
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
                            <Text className="text-white text-2xl font-bold">Menu Management</Text>
                            <Text className="text-[#A0A0A0] text-sm">{menuItems.length} items</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="bg-[#1DB954] px-4 py-2 rounded-full"
                        onPress={() => {/* Navigate to Add Item Screen */ }}
                    >
                        <Text className="text-black font-bold">+ Add</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-4">
                <SearchBarComponent
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search menu items..."
                />
            </View>

            {/* Categories */}
            <View className="mb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            className={`px-4 py-2 rounded-full mr-3 ${selectedCategory === cat ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text className={selectedCategory === cat ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Menu Items List */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {filteredItems.map((item) => (
                    <View key={item.id} className="flex-row mb-4 bg-[#1E1E1E] p-3 rounded-xl border border-[#333]">
                        <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg" />
                        <View className="flex-1 ml-3">
                            <View className="flex-row justify-between items-start mb-1">
                                <Text className="text-white font-bold text-base flex-1 mr-2">{item.name}</Text>
                                <TouchableOpacity
                                    className={`px-2 py-1 rounded-full ${item.available ? 'bg-[#1DB95420] border border-[#1DB954]' : 'bg-[#FF6B6B20] border border-[#FF6B6B]'}`}
                                    onPress={() => toggleAvailability(item.id)}
                                >
                                    <Text className={`text-xs font-bold ${item.available ? 'text-[#1DB954]' : 'text-[#FF6B6B]'}`}>
                                        {item.available ? '✓ Available' : '✗ Unavailable'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <Text className="text-[#666] text-xs mb-2" numberOfLines={1}>{item.description}</Text>
                            <View className="flex-row justify-between items-center">
                                <Text className="text-[#1DB954] font-bold text-lg">${item.price}</Text>
                                <View className="flex-row space-x-2">
                                    <TouchableOpacity
                                        className="bg-[#1E1E1E] border border-[#1DB954] px-3 py-1 rounded-lg"
                                        onPress={() => {/* Navigate to Edit Screen */ }}
                                    >
                                        <Text className="text-[#1DB954] text-xs font-bold">Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="bg-[#1E1E1E] border border-[#FF6B6B] px-3 py-1 rounded-lg"
                                        onPress={() => deleteItem(item.id)}
                                    >
                                        <Text className="text-[#FF6B6B] text-xs font-bold">Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
