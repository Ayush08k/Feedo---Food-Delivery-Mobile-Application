import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage, LANGUAGES, Language } from '../utils/LanguageContext';

export default function DriverLanguageScreen() {
    const navigation = useNavigation<any>();
    const { language, setLanguage } = useLanguage();

    const handleSelect = async (code: Language) => {
        await setLanguage(code);
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
                        backgroundColor: '#1E1E1E', alignItems: 'center',
                        justifyContent: 'center', marginRight: 12,
                    }}
                >
                    <Ionicons name="arrow-back" size={20} color="#fff" />
                </TouchableOpacity>
                <View>
                    <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>Language</Text>
                    <Text style={{ color: '#A0A0A0', fontSize: 13 }}>Select your preferred language</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                <View style={{
                    backgroundColor: '#1E1E1E', borderRadius: 16,
                    overflow: 'hidden', borderWidth: 1, borderColor: '#333',
                }}>
                    {LANGUAGES.map((lang, index) => {
                        const isSelected = lang.code === language;
                        return (
                            <TouchableOpacity
                                key={lang.code}
                                onPress={() => handleSelect(lang.code)}
                                style={{
                                    flexDirection: 'row', alignItems: 'center',
                                    padding: 16,
                                    backgroundColor: isSelected ? '#1DB95415' : 'transparent',
                                    borderBottomWidth: index !== LANGUAGES.length - 1 ? 1 : 0,
                                    borderBottomColor: '#333',
                                }}
                            >
                                <Text style={{ fontSize: 32, marginRight: 16 }}>{lang.flag}</Text>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        color: isSelected ? '#1DB954' : '#fff',
                                        fontSize: 16, fontWeight: 'bold', marginBottom: 2,
                                    }}>
                                        {lang.name}
                                    </Text>
                                    <Text style={{ color: '#A0A0A0', fontSize: 13 }}>{lang.nativeName}</Text>
                                </View>
                                {isSelected && (
                                    <View style={{
                                        width: 28, height: 28, borderRadius: 14,
                                        backgroundColor: '#1DB954',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Ionicons name="checkmark" size={18} color="#000" />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{
                    marginTop: 20, padding: 14,
                    backgroundColor: '#1DB95410', borderRadius: 12,
                    borderWidth: 1, borderColor: '#1DB95430',
                    flexDirection: 'row', alignItems: 'flex-start',
                }}>
                    <Ionicons name="information-circle-outline" size={18} color="#1DB954" style={{ marginRight: 8, marginTop: 1 }} />
                    <Text style={{ color: '#A0A0A0', fontSize: 13, flex: 1, lineHeight: 20 }}>
                        The app language will change immediately after selection.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
