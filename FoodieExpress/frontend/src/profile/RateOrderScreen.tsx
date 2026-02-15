import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';

export default function RateOrderScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { order } = route.params || {};
    const { showAlert } = useAlert();

    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = () => {
        if (rating === 0) {
            showAlert('Rating Required', 'Please select a star rating before submitting.');
            return;
        }

        // TODO: Save rating and feedback to backend
        showAlert(
            'Thank You!',
            'Your feedback has been submitted successfully.',
            [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]
        );
    };

    const renderStars = () => {
        return (
            <View className="flex-row justify-center my-8">
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => setRating(star)}
                        onPressIn={() => setHoveredStar(star)}
                        onPressOut={() => setHoveredStar(0)}
                        className="mx-2"
                        activeOpacity={0.7}
                    >
                        <Text
                            className="text-6xl"
                            style={{
                                color: star <= (hoveredStar || rating) ? '#FFD93D' : '#333',
                                transform: [{ scale: star === hoveredStar ? 1.2 : 1 }],
                            }}
                        >
                            {star <= (hoveredStar || rating) ? '★' : '☆'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const getRatingLabel = () => {
        switch (rating) {
            case 1: return 'Poor';
            case 2: return 'Fair';
            case 3: return 'Good';
            case 4: return 'Very Good';
            case 5: return 'Excellent';
            default: return 'Tap to rate';
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#1a1a1a] border-b border-[#333]">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 w-10 h-10 bg-[#1E1E1E] rounded-full items-center justify-center border border-[#333]"
                    >
                        <Text className="text-[#1DB954] text-xl">←</Text>
                    </TouchableOpacity>
                    <View>
                        <Text className="text-white text-2xl font-bold">Rate Your Order</Text>
                        <Text className="text-[#666] text-sm">{order?.orderNumber}</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Order Info */}
                <View className="mt-6 bg-[#1a1a1a] rounded-2xl p-4 border border-[#333]">
                    <Text className="text-white text-lg font-bold mb-2">{order?.restaurantName}</Text>
                    <Text className="text-[#888] text-sm mb-2">
                        {order?.items?.join(' • ')}
                    </Text>
                    <View className="flex-row items-center justify-between">
                        <Text className="text-[#666] text-xs">{order?.orderDate} • {order?.orderTime}</Text>
                        <Text className="text-[#1DB954] font-bold text-lg">${order?.totalAmount?.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Rating Section */}
                <View className="mt-8 bg-[#1a1a1a] rounded-2xl p-6 border border-[#333]">
                    <Text className="text-white text-xl font-bold text-center mb-2">How was your experience?</Text>
                    <Text className="text-[#666] text-sm text-center mb-4">
                        Your feedback helps us improve
                    </Text>

                    {renderStars()}

                    <Text className="text-center text-[#1DB954] text-lg font-bold mb-4">
                        {getRatingLabel()}
                    </Text>

                    {/* Rating descriptions */}
                    {rating > 0 && (
                        <View className="mt-2 p-3 bg-[#1DB954]/10 rounded-xl border border-[#1DB954]/20">
                            <Text className="text-[#1DB954] text-sm text-center">
                                {rating >= 4
                                    ? '🎉 We\'re thrilled you enjoyed your meal!'
                                    : rating === 3
                                        ? '😊 Thanks for your feedback. We\'ll keep improving!'
                                        : '😔 We\'re sorry to hear that. We\'ll do better!'}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Feedback Section */}
                <View className="mt-6 mb-6">
                    <Text className="text-white text-lg font-bold mb-3">
                        Additional Feedback {rating > 0 && <Text className="text-[#666] text-sm">(Optional)</Text>}
                    </Text>
                    <TextInput
                        className="bg-[#1a1a1a] text-white p-4 rounded-2xl border-2 border-[#333] min-h-[120px]"
                        placeholder={rating >= 4
                            ? "What did you love about your order?"
                            : rating > 0
                                ? "How can we improve your experience?"
                                : "Tell us about your experience..."}
                        placeholderTextColor="#666"
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                        value={feedback}
                        onChangeText={setFeedback}
                        maxLength={500}
                    />
                    <Text className="text-[#666] text-xs mt-2 text-right">
                        {feedback.length}/500 characters
                    </Text>
                </View>

                {/* Submit Button */}
                <TouchableOpacity
                    className={`py-4 rounded-xl items-center mb-8 ${rating > 0 ? 'bg-[#1DB954]' : 'bg-[#333]'}`}
                    onPress={handleSubmit}
                    disabled={rating === 0}
                >
                    <Text className={`font-bold text-lg ${rating > 0 ? 'text-black' : 'text-[#666]'}`}>
                        Submit Rating
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
