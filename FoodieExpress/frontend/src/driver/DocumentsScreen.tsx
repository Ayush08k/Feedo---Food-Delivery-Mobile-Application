import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

interface Document {
    id: number;
    name: string;
    type: string;
    status: 'verified' | 'pending' | 'expired';
    uploadedDate: string;
    expiryDate?: string;
    fileUrl?: string;
}

export default function DocumentsScreen() {
    const navigation = useNavigation<any>();

    const documents: Document[] = [
        { id: 1, name: 'Driving License', type: 'License', status: 'verified', uploadedDate: '2025-06-15', expiryDate: '2030-06-15' },
        { id: 2, name: 'Vehicle Registration (RC)', type: 'RC', status: 'verified', uploadedDate: '2025-06-15', expiryDate: '2027-12-31' },
        { id: 3, name: 'Vehicle Insurance', type: 'Insurance', status: 'verified', uploadedDate: '2025-06-15', expiryDate: '2026-06-30' },
        { id: 4, name: 'PAN Card', type: 'ID Proof', status: 'verified', uploadedDate: '2025-06-15' },
        { id: 5, name: 'Aadhar Card', type: 'ID Proof', status: 'verified', uploadedDate: '2025-06-15' },
        { id: 6, name: 'Profile Photo', type: 'Photo', status: 'verified', uploadedDate: '2025-06-15' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return '#1DB954';
            case 'pending': return '#FFD93D';
            case 'expired': return '#FF6B6B';
            default: return '#666';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'verified': return '✓';
            case 'pending': return '⏱';
            case 'expired': return '✗';
            default: return '?';
        }
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
                            <Text className="text-white text-2xl font-bold">Documents</Text>
                            <Text className="text-[#A0A0A0] text-sm">
                                {documents.filter(d => d.status === 'verified').length} verified
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity className="bg-[#1DB954] px-4 py-2 rounded-full">
                        <Text className="text-black font-bold">+ Upload</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Summary Cards */}
            <View className="px-4 py-4 bg-[#1E1E1E] border-b border-[#333]">
                <View className="flex-row space-x-4">
                    <View className="flex-1 bg-[#121212] p-3 rounded-lg">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Verified</Text>
                        <Text className="text-[#1DB954] text-2xl font-bold mt-1">
                            {documents.filter(d => d.status === 'verified').length}
                        </Text>
                    </View>
                    <View className="flex-1 bg-[#121212] p-3 rounded-lg">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Pending</Text>
                        <Text className="text-[#FFD93D] text-2xl font-bold mt-1">
                            {documents.filter(d => d.status === 'pending').length}
                        </Text>
                    </View>
                    <View className="flex-1 bg-[#121212] p-3 rounded-lg">
                        <Text className="text-[#A0A0A0] text-xs uppercase font-bold">Expired</Text>
                        <Text className="text-[#FF6B6B] text-2xl font-bold mt-1">
                            {documents.filter(d => d.status === 'expired').length}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                <View className="py-4">
                    <Text className="text-white text-xl font-bold mb-4">All Documents</Text>
                    {documents.map((doc) => (
                        <View key={doc.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-4">
                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1">
                                    <Text className="text-white font-bold text-lg mb-1">{doc.name}</Text>
                                    <Text className="text-[#666] text-sm">{doc.type}</Text>
                                </View>
                                <View
                                    className="px-3 py-1 rounded-full"
                                    style={{
                                        backgroundColor: getStatusColor(doc.status) + '20',
                                        borderColor: getStatusColor(doc.status),
                                        borderWidth: 1
                                    }}
                                >
                                    <Text
                                        className="text-xs font-bold"
                                        style={{ color: getStatusColor(doc.status) }}
                                    >
                                        {getStatusIcon(doc.status)} {doc.status.toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            <View className="space-y-2">
                                <View className="flex-row justify-between">
                                    <Text className="text-[#666] text-sm">Uploaded</Text>
                                    <Text className="text-white text-sm">{doc.uploadedDate}</Text>
                                </View>
                                {doc.expiryDate && (
                                    <View className="flex-row justify-between">
                                        <Text className="text-[#666] text-sm">Expires</Text>
                                        <Text className="text-white text-sm">{doc.expiryDate}</Text>
                                    </View>
                                )}
                            </View>

                            <View className="flex-row space-x-2 pt-3 border-t border-[#333] mt-3">
                                <TouchableOpacity className="flex-1 bg-[#121212] border border-[#1DB954] px-4 py-2 rounded-lg">
                                    <Text className="text-[#1DB954] text-center font-bold text-sm">View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-[#121212] border border-[#FFD93D] px-4 py-2 rounded-lg">
                                    <Text className="text-[#FFD93D] text-center font-bold text-sm">Re-upload</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
