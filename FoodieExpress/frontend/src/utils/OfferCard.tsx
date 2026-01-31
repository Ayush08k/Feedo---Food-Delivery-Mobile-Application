import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface OfferCardProps {
    title: string;
    description: string;
    color: string;
    onPress?: () => void;
    size?: 'small' | 'medium' | 'large';
}

export default function OfferCard({
    title,
    description,
    color,
    onPress,
    size = 'medium'
}: OfferCardProps) {
    const width = size === 'small' ? 'w-48' : size === 'large' ? 'w-80' : 'w-64';
    const padding = size === 'small' ? 'p-4' : 'p-6';

    return (
        <TouchableOpacity
            className={`${width} ${padding} rounded-2xl mr-4`}
            style={{ backgroundColor: color + '20', borderColor: color, borderWidth: 1 }}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text className="text-2xl font-bold mb-2" style={{ color }}>{title}</Text>
            <Text className="text-white">{description}</Text>
        </TouchableOpacity>
    );
}
