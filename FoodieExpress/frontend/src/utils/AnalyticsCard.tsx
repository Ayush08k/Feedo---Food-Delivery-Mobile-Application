import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnalyticsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: string;
    onPress?: () => void;
}

export default function AnalyticsCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    trendValue,
    color = '#1DB954',
    onPress
}: AnalyticsCardProps) {
    const trendColor = trend === 'up' ? '#1DB954' : trend === 'down' ? '#FF6B6B' : '#A0A0A0';
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';

    const CardContent = (
        <View className="bg-[#1E1E1E] p-4 rounded-xl border border-[#333] flex-1">
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-[#A0A0A0] text-xs uppercase font-bold flex-1">{title}</Text>
                {icon && <Text className="text-xl">{icon}</Text>}
            </View>
            <Text className="text-white text-2xl font-bold mb-1" style={{ color }}>{value}</Text>
            {subtitle && <Text className="text-[#666] text-xs">{subtitle}</Text>}
            {trend && trendValue && (
                <View className="flex-row items-center mt-2">
                    <Text className="text-xs font-bold mr-1" style={{ color: trendColor }}>
                        {trendIcon} {trendValue}
                    </Text>
                    <Text className="text-[#666] text-xs">vs last period</Text>
                </View>
            )}
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} className="flex-1">
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
}
