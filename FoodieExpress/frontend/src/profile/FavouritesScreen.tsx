import React from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Image,
    Animated, useRef,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useFavourites } from '../utils/FavouritesContext';
import { useCart } from '../cart/CartContext';

export default function FavouritesScreen() {
    const navigation = useNavigation<any>();
    const { favourites, removeFavourite } = useFavourites();
    const { addToCart } = useCart();

    const handleOrder = (item: any) => {
        const priceNum = parseFloat(item.price.replace('$', ''));
        addToCart(
            { id: item.id, name: item.name, price: priceNum, image: item.image },
            0
        );
        navigation.navigate('Main', { screen: 'Cart' });
    };

    const handleRemove = (id: number) => {
        removeFavourite(id);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 16,
                borderBottomWidth: 1, borderBottomColor: '#333',
            }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        width: 40, height: 40, borderRadius: 20,
                        backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center',
                        marginRight: 12,
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
                        Favourite Foods
                    </Text>
                    <Text style={{ color: '#A0A0A0', fontSize: 13 }}>
                        {favourites.length} item{favourites.length !== 1 ? 's' : ''} saved
                    </Text>
                </View>
                <Ionicons name="heart" size={24} color="#FF4D4D" />
            </View>

            {favourites.length === 0 ? (
                /* Empty State */
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                    <View style={{
                        width: 100, height: 100, borderRadius: 50,
                        backgroundColor: '#1E1E1E', alignItems: 'center', justifyContent: 'center',
                        marginBottom: 20, borderWidth: 2, borderColor: '#FF4D4D33',
                    }}>
                        <Ionicons name="heart-outline" size={48} color="#FF4D4D" />
                    </View>
                    <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>
                        No Favourites Yet
                    </Text>
                    <Text style={{ color: '#A0A0A0', fontSize: 14, textAlign: 'center', lineHeight: 20 }}>
                        Tap the ❤️ on any food item to save it here for quick ordering later.
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Main', { screen: 'Home' })}
                        style={{
                            marginTop: 24, backgroundColor: '#1DB954',
                            paddingHorizontal: 28, paddingVertical: 14,
                            borderRadius: 12,
                        }}
                    >
                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                            🍔 Explore Food
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
                    {favourites.map((item, index) => (
                        <View
                            key={item.id}
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#1E1E1E',
                                borderRadius: 16,
                                overflow: 'hidden',
                                marginBottom: 16,
                                borderWidth: 1,
                                borderColor: '#333',
                            }}
                        >
                            {/* Food Image */}
                            <Image
                                source={{ uri: item.image }}
                                style={{ width: 100, height: 100 }}
                                resizeMode="cover"
                            />

                            {/* Info */}
                            <View style={{ flex: 1, padding: 12 }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 2 }} numberOfLines={1}>
                                    {item.name}
                                </Text>
                                <Text style={{ color: '#A0A0A0', fontSize: 12, marginBottom: 4 }} numberOfLines={1}>
                                    {item.restaurant}
                                </Text>
                                <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 15, marginBottom: 10 }}>
                                    {item.price}
                                </Text>

                                {/* Action Buttons */}
                                <View style={{ flexDirection: 'row', gap: 8 }}>
                                    {/* Order Button */}
                                    <TouchableOpacity
                                        onPress={() => handleOrder(item)}
                                        style={{
                                            flex: 1, backgroundColor: '#1DB954',
                                            borderRadius: 8, paddingVertical: 7,
                                            alignItems: 'center', flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Ionicons name="cart" size={14} color="#000" style={{ marginRight: 4 }} />
                                        <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 13 }}>
                                            Order
                                        </Text>
                                    </TouchableOpacity>

                                    {/* Remove Button */}
                                    <TouchableOpacity
                                        onPress={() => handleRemove(item.id)}
                                        style={{
                                            flex: 1, backgroundColor: '#FF4D4D18',
                                            borderRadius: 8, paddingVertical: 7,
                                            alignItems: 'center', flexDirection: 'row',
                                            justifyContent: 'center',
                                            borderWidth: 1, borderColor: '#FF4D4D55',
                                        }}
                                    >
                                        <Ionicons name="heart-dislike" size={14} color="#FF4D4D" style={{ marginRight: 4 }} />
                                        <Text style={{ color: '#FF4D4D', fontWeight: 'bold', fontSize: 13 }}>
                                            Remove
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}

                    {/* Bottom Padding */}
                    <View style={{ height: 20 }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
