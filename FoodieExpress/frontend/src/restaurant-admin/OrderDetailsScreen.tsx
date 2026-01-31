import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function OrderDetailsScreen() {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { order } = route.params || {};

    const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending');

    if (!order) {
        return (
            <SafeAreaView className="flex-1 bg-[#121212] items-center justify-center">
                <Text className="text-white">Order not found</Text>
            </SafeAreaView>
        );
    }

    const statusFlow = ['pending', 'preparing', 'ready', 'picked-up'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return '#FFD93D';
            case 'preparing': return '#FF9800';
            case 'ready': return '#1DB954';
            case 'picked-up': return '#00BCD4';
            case 'delivered': return '#666';
            case 'cancelled': return '#FF6B6B';
            default: return '#666';
        }
    };

    const updateStatus = (newStatus: string) => {
        setCurrentStatus(newStatus);
        Alert.alert('Success', `Order status updated to ${newStatus}`);
    };

    const cancelOrder = () => {
        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => {
                        setCurrentStatus('cancelled');
                        Alert.alert('Order Cancelled', 'The order has been cancelled successfully');
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-[#121212]">
            {/* Header */}
            <View className="px-4 py-4 bg-[#121212] border-b border-[#333]">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-2 rounded-full bg-[#1E1E1E]"
                    >
                        <Text className="text-white">←</Text>
                    </TouchableOpacity>
                    <View className="flex-1">
                        <Text className="text-white text-2xl font-bold">{order.id}</Text>
                        <Text className="text-[#A0A0A0] text-sm">{order.orderTime}</Text>
                    </View>
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{
                            backgroundColor: getStatusColor(currentStatus) + '20',
                            borderColor: getStatusColor(currentStatus),
                            borderWidth: 1
                        }}
                    >
                        <Text
                            className="text-xs font-bold capitalize"
                            style={{ color: getStatusColor(currentStatus) }}
                        >
                            {currentStatus}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Customer Info */}
                <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] my-4">
                    <Text className="text-white text-lg font-bold mb-3">Customer Information</Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-[#666]">Name</Text>
                            <Text className="text-white font-semibold">{order.customerName}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-[#666]">Delivery Address</Text>
                            <Text className="text-white font-semibold text-right flex-1 ml-4">{order.deliveryAddress}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-[#666]">Payment Method</Text>
                            <Text className="text-white font-semibold">{order.paymentMethod}</Text>
                        </View>
                    </View>
                </View>

                {/* Order Items */}
                <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                    <Text className="text-white text-lg font-bold mb-3">Order Items</Text>
                    {order.items.map((item: any, index: number) => (
                        <View key={index} className="flex-row justify-between items-center py-2 border-b border-[#333]">
                            <View className="flex-1">
                                <Text className="text-white font-semibold">{item.name}</Text>
                                <Text className="text-[#666] text-sm">Quantity: {item.quantity}</Text>
                            </View>
                            <Text className="text-white font-bold">${(item.price * item.quantity).toFixed(2)}</Text>
                        </View>
                    ))}

                    <View className="flex-row justify-between items-center pt-4 mt-2 border-t border-[#333]">
                        <Text className="text-[#A0A0A0] text-lg font-bold">Total Amount</Text>
                        <Text className="text-[#1DB954] text-2xl font-bold">${order.totalAmount.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Status Progress */}
                {currentStatus !== 'cancelled' && currentStatus !== 'delivered' && (
                    <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                        <Text className="text-white text-lg font-bold mb-4">Update Order Status</Text>
                        <View className="space-y-2">
                            {statusFlow.map((status, index) => {
                                const isCurrentStatus = status === currentStatus;
                                const isPreviousStatus = statusFlow.indexOf(currentStatus) > index;
                                const isNextStatus = statusFlow.indexOf(currentStatus) === index - 1;

                                return (
                                    <TouchableOpacity
                                        key={status}
                                        className={`p-4 rounded-xl border-2 ${isCurrentStatus
                                                ? 'bg-[#1DB954] border-[#1DB954]'
                                                : isPreviousStatus
                                                    ? 'bg-[#121212] border-[#666]'
                                                    : isNextStatus
                                                        ? 'bg-[#121212] border-[#1DB954]'
                                                        : 'bg-[#121212] border-[#333]'
                                            }`}
                                        onPress={() => isNextStatus && updateStatus(status)}
                                        disabled={!isNextStatus}
                                    >
                                        <View className="flex-row items-center justify-between">
                                            <Text
                                                className={`font-bold capitalize ${isCurrentStatus ? 'text-black' : 'text-white'
                                                    }`}
                                            >
                                                {status.replace('-', ' ')}
                                            </Text>
                                            {isCurrentStatus && (
                                                <Text className="text-black">✓</Text>
                                            )}
                                            {isPreviousStatus && (
                                                <Text className="text-[#666]">✓</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Action Buttons */}
                {currentStatus !== 'cancelled' && currentStatus !== 'delivered' && (
                    <View className="mb-6">
                        <TouchableOpacity
                            className="bg-[#1E1E1E] border-2 border-[#FF6B6B] p-4 rounded-xl"
                            onPress={cancelOrder}
                        >
                            <Text className="text-[#FF6B6B] font-bold text-center text-lg">Cancel Order</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
