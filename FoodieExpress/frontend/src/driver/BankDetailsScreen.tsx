import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../utils/AlertContext';

export default function BankDetailsScreen() {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();
    const [isEditing, setIsEditing] = useState(false);

    const [bankDetails, setBankDetails] = useState({
        accountHolderName: 'John Doe',
        accountNumber: '1234567890123456',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branch: 'Downtown Branch',
        accountType: 'Savings'
    });

    const [editedDetails, setEditedDetails] = useState(bankDetails);
    const [focused, setFocused] = useState('');

    const handleSave = () => {
        if (!editedDetails.accountHolderName || !editedDetails.accountNumber || !editedDetails.ifscCode) {
            showAlert('Error', 'Please fill all required fields');
            return;
        }

        setBankDetails(editedDetails);
        setIsEditing(false);
        showAlert('Success', 'Bank details updated successfully!');
    };

    const handleCancel = () => {
        setEditedDetails(bankDetails);
        setIsEditing(false);
    };

    const renderField = (label: string, value: string, key: keyof typeof bankDetails, options: any = {}) => {
        if (isEditing) {
            return (
                <View className="mb-4">
                    <Text className="text-[#A0A0A0] mb-2 ml-1">{label}</Text>
                    <TextInput
                        className="bg-[#121212] text-white p-4 rounded-xl"
                        style={{
                            borderWidth: 2,
                            borderColor: focused === key ? '#1DB954' : '#333'
                        }}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        placeholderTextColor="#666"
                        value={editedDetails[key]}
                        onChangeText={(text) => setEditedDetails({ ...editedDetails, [key]: text })}
                        onFocus={() => setFocused(key)}
                        onBlur={() => setFocused('')}
                        {...options}
                    />
                </View>
            );
        }

        return (
            <View className="flex-row justify-between py-3 border-b border-[#333]">
                <Text className="text-[#666]">{label}</Text>
                <Text className="text-white font-semibold">{value}</Text>
            </View>
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
                            <Text className="text-white text-2xl font-bold">Bank Details</Text>
                            <Text className="text-[#A0A0A0] text-sm">For earnings withdrawal</Text>
                        </View>
                    </View>
                    {!isEditing && (
                        <TouchableOpacity
                            className="bg-[#1DB954] px-4 py-2 rounded-full"
                            onPress={() => setIsEditing(true)}
                        >
                            <Text className="text-black font-bold">Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Available Balance */}
                <View className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#333] my-6">
                    <Text className="text-[#A0A0A0] text-xs uppercase font-bold mb-2">Available Balance</Text>
                    <Text className="text-[#1DB954] text-4xl font-bold mb-4">$342.50</Text>
                    <TouchableOpacity className="bg-[#1DB954] p-4 rounded-xl">
                        <Text className="text-black font-bold text-center text-lg">Withdraw to Bank</Text>
                    </TouchableOpacity>
                    <Text className="text-[#666] text-xs text-center mt-2">
                        Withdrawals typically take 1-3 business days
                    </Text>
                </View>

                {/* Bank Account Information */}
                <View className="mb-6">
                    <Text className="text-white text-xl font-bold mb-4">Account Information</Text>
                    <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333]">
                        {renderField('Account Holder Name', bankDetails.accountHolderName, 'accountHolderName')}
                        {renderField('Account Number', bankDetails.accountNumber, 'accountNumber', { keyboardType: 'number-pad' })}
                        {renderField('IFSC Code', bankDetails.ifscCode, 'ifscCode', { autoCapitalize: 'characters' })}
                        {renderField('Bank Name', bankDetails.bankName, 'bankName')}
                        {renderField('Branch', bankDetails.branch, 'branch')}
                        {renderField('Account Type', bankDetails.accountType, 'accountType')}
                    </View>
                </View>

                {/* Action Buttons (when editing) */}
                {isEditing && (
                    <View className="flex-row space-x-4 mb-6">
                        <TouchableOpacity
                            className="flex-1 bg-[#1E1E1E] border border-[#FF6B6B] p-4 rounded-xl"
                            onPress={handleCancel}
                        >
                            <Text className="text-[#FF6B6B] font-bold text-center">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="flex-1 bg-[#1DB954] p-4 rounded-xl"
                            onPress={handleSave}
                        >
                            <Text className="text-black font-bold text-center">Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Recent Withdrawals */}
                {!isEditing && (
                    <View className="mb-6">
                        <Text className="text-white text-xl font-bold mb-4">Recent Withdrawals</Text>
                        {[
                            { id: 1, amount: 500.00, date: '2026-01-25', status: 'Completed' },
                            { id: 2, amount: 750.00, date: '2026-01-18', status: 'Completed' },
                            { id: 3, amount: 425.50, date: '2026-01-10', status: 'Completed' },
                        ].map((withdrawal) => (
                            <View key={withdrawal.id} className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] mb-3">
                                <View className="flex-row justify-between items-center">
                                    <View>
                                        <Text className="text-white font-bold text-lg">${withdrawal.amount.toFixed(2)}</Text>
                                        <Text className="text-[#666] text-sm">{withdrawal.date}</Text>
                                    </View>
                                    <View className="bg-[#1DB95420] border border-[#1DB954] px-3 py-1 rounded-full">
                                        <Text className="text-[#1DB954] text-xs font-bold">{withdrawal.status}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                <View className="h-20" />
            </ScrollView>
        </SafeAreaView>
    );
}
