import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    ScrollView, Animated, Keyboard, TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function FeedbackScreen() {
    const navigation = useNavigation<any>();
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [category, setCategory] = useState<string | null>(null);

    const CATEGORIES = ['🐛 Bug', '💡 Suggestion', '⭐ Compliment', '❓ Question'];

    const handleSubmit = () => {
        if (!feedback.trim()) return;
        Keyboard.dismiss();
        setSubmitted(true);
    };

    const handleAnother = () => {
        setFeedback('');
        setCategory(null);
        setSubmitted(false);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                            backgroundColor: '#1E1E1E', alignItems: 'center',
                            justifyContent: 'center', marginRight: 12,
                        }}
                    >
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View>
                        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Send Feedback</Text>
                        <Text style={{ color: '#A0A0A0', fontSize: 13 }}>We value your thoughts</Text>
                    </View>
                </View>

                <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                    {submitted ? (
                        /* ── Success State ── */
                        <View style={{ alignItems: 'center', paddingTop: 60 }}>
                            <View style={{
                                width: 100, height: 100, borderRadius: 50,
                                backgroundColor: '#1DB95420', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 20, borderWidth: 2, borderColor: '#1DB95440',
                            }}>
                                <Ionicons name="checkmark-circle" size={60} color="#1DB954" />
                            </View>
                            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 8 }}>
                                Feedback Submitted!
                            </Text>
                            <Text style={{ color: '#A0A0A0', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 32 }}>
                                Thank you for taking the time to share your feedback. We'll review it and use it to improve Feedo.
                            </Text>
                            <TouchableOpacity
                                onPress={handleAnother}
                                style={{
                                    backgroundColor: '#1E1E1E', paddingHorizontal: 28,
                                    paddingVertical: 14, borderRadius: 12,
                                    borderWidth: 1, borderColor: '#1DB954',
                                }}
                            >
                                <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 15 }}>
                                    Send Another
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        /* ── Form State ── */
                        <>
                            {/* Category */}
                            <Text style={{ color: '#A0A0A0', fontSize: 13, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Category (optional)
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                {CATEGORIES.map(cat => (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setCategory(category === cat ? null : cat)}
                                        style={{
                                            paddingHorizontal: 14, paddingVertical: 8,
                                            borderRadius: 20, borderWidth: 1,
                                            backgroundColor: category === cat ? '#1DB95420' : '#1E1E1E',
                                            borderColor: category === cat ? '#1DB954' : '#333',
                                        }}
                                    >
                                        <Text style={{
                                            color: category === cat ? '#1DB954' : '#A0A0A0',
                                            fontSize: 13, fontWeight: '500',
                                        }}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Feedback Text Area */}
                            <Text style={{ color: '#A0A0A0', fontSize: 13, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Your Feedback
                            </Text>
                            <TextInput
                                value={feedback}
                                onChangeText={setFeedback}
                                placeholder="Write your complaint, suggestion or feedback here..."
                                placeholderTextColor="#555"
                                multiline
                                numberOfLines={8}
                                textAlignVertical="top"
                                style={{
                                    backgroundColor: '#1E1E1E',
                                    color: '#fff',
                                    borderRadius: 14,
                                    borderWidth: 1,
                                    borderColor: feedback.length > 0 ? '#1DB954' : '#333',
                                    padding: 14,
                                    fontSize: 15,
                                    lineHeight: 22,
                                    minHeight: 160,
                                    marginBottom: 8,
                                }}
                            />
                            <Text style={{ color: '#555', fontSize: 12, textAlign: 'right', marginBottom: 20 }}>
                                {feedback.length} characters
                            </Text>

                            {/* Submit Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={!feedback.trim()}
                                style={{
                                    backgroundColor: feedback.trim() ? '#1DB954' : '#1E1E1E',
                                    paddingVertical: 16, borderRadius: 14,
                                    alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: feedback.trim() ? '#1DB954' : '#333',
                                }}
                            >
                                <Ionicons
                                    name="send"
                                    size={18}
                                    color={feedback.trim() ? '#000' : '#555'}
                                    style={{ marginRight: 8 }}
                                />
                                <Text style={{
                                    color: feedback.trim() ? '#000' : '#555',
                                    fontWeight: 'bold', fontSize: 16,
                                }}>
                                    Submit Feedback
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
