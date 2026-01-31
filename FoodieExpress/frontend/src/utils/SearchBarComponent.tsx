import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, Animated, Keyboard, TouchableWithoutFeedback } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onSubmit?: () => void;
    suggestions?: Array<{ id: string | number; name: string; subtitle?: string; icon?: string }>;
    onSuggestionPress?: (suggestion: any) => void;
    recentSearches?: string[];
    onRecentSearchPress?: (search: string) => void;
    onClearHistory?: () => void;
}

export default function SearchBarComponent({
    value,
    onChangeText,
    placeholder = 'Search...',
    onSubmit,
    suggestions = [],
    onSuggestionPress,
    recentSearches = [],
    onRecentSearchPress,
    onClearHistory
}: SearchBarProps) {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const searchInputRef = useRef<TextInput>(null);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    // Animate dropdown when showSuggestions changes
    useEffect(() => {
        if (showSuggestions) {
            setShouldRender(true);
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 10,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setShouldRender(false);
            });
        }
    }, [showSuggestions]);

    const dismissSearch = () => {
        setShowSuggestions(false);
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissSearch}>
            <View className="relative z-10">
                <View
                    className="bg-[#1E1E1E] flex-row items-center p-3 rounded-xl"
                    style={{
                        borderWidth: 2,
                        borderColor: isSearchFocused ? '#1DB954' : '#333',
                    }}
                >
                    <Text className="mr-2">🔍</Text>
                    <TextInput
                        ref={searchInputRef}
                        placeholder={placeholder}
                        placeholderTextColor="#666"
                        className="flex-1 text-white"
                        value={value}
                        onChangeText={(text) => {
                            onChangeText(text);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => {
                            setIsSearchFocused(true);
                            setShowSuggestions(true);
                        }}
                        onBlur={() => {
                            setIsSearchFocused(false);
                            setTimeout(() => setShowSuggestions(false), 200);
                        }}
                        onSubmitEditing={onSubmit}
                        returnKeyType="search"
                    />
                </View>

                {/* Autocomplete Suggestions & Recent Searches Dropdown */}
                {shouldRender && (
                    <Animated.View
                        className="absolute top-16 left-0 right-0 bg-[#1E1E1E] rounded-xl border border-[#333] overflow-hidden shadow-lg"
                        style={{
                            zIndex: 1000,
                            opacity: opacityAnim,
                            transform: [
                                {
                                    translateY: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-20, 0],
                                    }),
                                },
                                {
                                    scale: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.95, 1],
                                    }),
                                },
                            ],
                        }}
                    >
                        {value.length >= 2 && suggestions.length > 0 ? (
                            <>
                                {suggestions.map((suggestion, index) => (
                                    <TouchableOpacity
                                        key={suggestion.id}
                                        className={`flex-row items-center p-3 ${index !== suggestions.length - 1 ? 'border-b border-[#333]' : ''}`}
                                        onPress={() => {
                                            onSuggestionPress?.(suggestion);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <Text className="mr-3 text-lg">{suggestion.icon || '🔍'}</Text>
                                        <View className="flex-1">
                                            <Text className="text-white font-semibold">{suggestion.name}</Text>
                                            {suggestion.subtitle && (
                                                <Text className="text-[#A0A0A0] text-xs">{suggestion.subtitle}</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </>
                        ) : recentSearches.length > 0 ? (
                            <>
                                <View className="flex-row items-center justify-between p-3 border-b border-[#333]">
                                    <Text className="text-[#A0A0A0] text-sm font-semibold">Recent Searches</Text>
                                    {onClearHistory && (
                                        <TouchableOpacity onPress={onClearHistory}>
                                            <Text className="text-[#FF6B6B] text-xs">Clear All</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {recentSearches.map((historyItem, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        className={`flex-row items-center p-3 ${index !== recentSearches.length - 1 ? 'border-b border-[#333]' : ''}`}
                                        onPress={() => {
                                            onRecentSearchPress?.(historyItem);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <Text className="mr-3 text-lg">🕒</Text>
                                        <Text className="flex-1 text-white">{historyItem}</Text>
                                        <Text className="text-[#666]">→</Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        ) : null}
                    </Animated.View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
}
