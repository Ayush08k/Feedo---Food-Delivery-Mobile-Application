import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Image,
    TextInput, Modal, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import SearchBarComponent from '../utils/SearchBarComponent';
import { useAlert } from '../utils/AlertContext';

/* ─── Types ──────────────────────────────────────────────────────────── */
interface MenuItem {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    available: boolean;
    options?: string;          // comma-separated options e.g. "Small, Medium, Large"
}

const EMPTY_FORM: Omit<MenuItem, 'id'> = {
    name: '',
    description: '',
    price: 0,
    category: 'Burgers',
    image: '',
    available: true,
    options: '',
};

const CATEGORIES = ['Burgers', 'Pizza', 'Sides', 'Drinks', 'Desserts'];
const ALL_CATEGORIES = ['All', ...CATEGORIES];

/* ─── Component ─────────────────────────────────────────────────────── */
export default function MenuManagementScreen() {
    const navigation = useNavigation<any>();
    const { showAlert } = useAlert();

    // ── list state ──────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        { id: 1, name: 'Double Cheeseburger', description: 'Two beef patties, cheddar, lettuce', price: 14, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80', available: true, options: 'Single, Double, Triple' },
        { id: 2, name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, tomato', price: 12.99, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=80', available: true, options: '8", 10", 12"' },
        { id: 3, name: 'Truffle Fries', description: 'Crispy fries with truffle oil', price: 8, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496987-a2267f70b77b?w=400&q=80', available: true, options: '' },
        { id: 4, name: 'Classic Milkshake', description: 'Vanilla bean milkshake', price: 6, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80', available: false, options: 'Vanilla, Chocolate, Strawberry' },
    ]);

    // ── add/edit modal ───────────────────────────────────────────────────
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);   // null → add mode
    const [form, setForm] = useState<Omit<MenuItem, 'id'>>(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState<Partial<Record<keyof Omit<MenuItem, 'id'>, string>>>({});

    // ── options popup ────────────────────────────────────────────────────
    const [optionsItem, setOptionsItem] = useState<MenuItem | null>(null);

    /* ── helpers ─────────────────────────────────────────────────────── */
    const filteredItems = menuItems.filter(item => {
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const validateForm = () => {
        const errors: typeof formErrors = {};
        if (!form.name.trim()) errors.name = 'Name is required';
        if (!form.description.trim()) errors.description = 'Description is required';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
            errors.price = 'Enter a valid price';
        if (!form.image.trim()) errors.image = 'Image URL is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const openAddModal = () => {
        setEditingId(null);
        setForm(EMPTY_FORM);
        setFormErrors({});
        setModalVisible(true);
    };

    const openEditModal = (item: MenuItem) => {
        setOptionsItem(null);
        setEditingId(item.id);
        setForm({
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            image: item.image,
            available: item.available,
            options: item.options ?? '',
        });
        setFormErrors({});
        setModalVisible(true);
    };

    const saveItem = () => {
        if (!validateForm()) return;
        if (editingId === null) {
            // Add new
            const newId = menuItems.length ? Math.max(...menuItems.map(i => i.id)) + 1 : 1;
            setMenuItems(prev => [...prev, { id: newId, ...form, price: Number(form.price) }]);
        } else {
            // Update existing
            setMenuItems(prev =>
                prev.map(item =>
                    item.id === editingId
                        ? { ...item, ...form, price: Number(form.price) }
                        : item
                )
            );
        }
        setModalVisible(false);
    };

    const toggleAvailability = (id: number) => {
        setOptionsItem(null);
        setMenuItems(prev =>
            prev.map(item => item.id === id ? { ...item, available: !item.available } : item)
        );
    };

    const deleteItem = (id: number) => {
        setOptionsItem(null);
        showAlert(
            'Delete Item',
            'Are you sure you want to delete this item?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => setMenuItems(prev => prev.filter(item => item.id !== id)),
                },
            ]
        );
    };

    /* ── render ──────────────────────────────────────────────────────── */
    return (
        <SafeAreaView className="flex-1 bg-[#121212]">

            {/* ── Header ─────────────────────────────────────────────── */}
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
                            <Text className="text-white text-2xl font-bold">Menu Management</Text>
                            <Text className="text-[#A0A0A0] text-sm">{menuItems.length} items</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        className="bg-[#1DB954] px-4 py-2 rounded-full"
                        onPress={openAddModal}
                    >
                        <Text className="text-black font-bold">+ Add Item</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Search Bar ─────────────────────────────────────────── */}
            <View className="px-4 py-4">
                <SearchBarComponent
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Search menu items..."
                />
            </View>

            {/* ── Category Chips ──────────────────────────────────────── */}
            <View className="mb-4">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {ALL_CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            className={`px-4 py-2 rounded-full mr-3 ${selectedCategory === cat ? 'bg-[#1DB954]' : 'bg-[#1E1E1E] border border-[#333]'}`}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text className={selectedCategory === cat ? 'text-black font-bold' : 'text-[#A0A0A0]'}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* ── Items List ──────────────────────────────────────────── */}
            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {filteredItems.length === 0 && (
                    <View className="items-center py-16">
                        <Text className="text-5xl mb-4">🍽️</Text>
                        <Text className="text-white text-lg font-bold mb-2">No items found</Text>
                        <Text className="text-[#666] text-sm text-center">Try a different category or tap "+ Add Item" to create one.</Text>
                    </View>
                )}
                {filteredItems.map(item => (
                    <View key={item.id} className="mb-4 bg-[#1E1E1E] rounded-xl border border-[#333] overflow-hidden">
                        {/* Image strip */}
                        <Image source={{ uri: item.image }} style={{ width: '100%', height: 130 }} resizeMode="cover" />

                        <View className="p-3">
                            {/* Name + availability badge */}
                            <View className="flex-row justify-between items-start mb-1">
                                <Text className="text-white font-bold text-base flex-1 mr-2">{item.name}</Text>
                                <View className={`px-2 py-1 rounded-full ${item.available ? 'bg-[#1DB95420] border border-[#1DB954]' : 'bg-[#FF6B6B20] border border-[#FF6B6B]'}`}>
                                    <Text className={`text-xs font-bold ${item.available ? 'text-[#1DB954]' : 'text-[#FF6B6B]'}`}>
                                        {item.available ? '✓ Available' : '✗ Unavailable'}
                                    </Text>
                                </View>
                            </View>

                            {/* Description */}
                            <Text className="text-[#666] text-xs mb-1" numberOfLines={1}>{item.description}</Text>

                            {/* Category */}
                            <Text className="text-[#888] text-xs mb-2">📂 {item.category}</Text>

                            {/* Options preview */}
                            {!!item.options && (
                                <View className="mb-2 flex-row flex-wrap">
                                    {item.options.split(',').map(opt => opt.trim()).filter(Boolean).map((opt, i) => (
                                        <View key={i} className="bg-[#2A2A2A] border border-[#444] px-2 py-0.5 rounded-full mr-1 mb-1">
                                            <Text className="text-[#A0A0A0] text-xs">{opt}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Price + action row */}
                            <View className="flex-row justify-between items-center mt-1">
                                <Text className="text-[#1DB954] font-bold text-xl">${Number(item.price).toFixed(2)}</Text>

                                <View className="flex-row" style={{ gap: 8 }}>
                                    {/* Edit */}
                                    <TouchableOpacity
                                        className="border border-[#1DB954] px-3 py-1.5 rounded-lg"
                                        onPress={() => openEditModal(item)}
                                    >
                                        <Text className="text-[#1DB954] text-xs font-bold">✏️ Edit</Text>
                                    </TouchableOpacity>

                                    {/* Options ⋮ */}
                                    <TouchableOpacity
                                        className="border border-[#444] px-3 py-1.5 rounded-lg"
                                        onPress={() => setOptionsItem(optionsItem?.id === item.id ? null : item)}
                                    >
                                        <Text className="text-[#A0A0A0] text-xs font-bold">⋮ Options</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Inline options panel */}
                            {optionsItem?.id === item.id && (
                                <View className="mt-3 pt-3 border-t border-[#333] flex-row" style={{ gap: 8 }}>
                                    <TouchableOpacity
                                        className="flex-1 items-center py-2 rounded-lg bg-[#2A2A2A] border border-[#444]"
                                        onPress={() => toggleAvailability(item.id)}
                                    >
                                        <Text className="text-[#A0A0A0] text-xs font-bold">
                                            {item.available ? '🔴 Mark Unavailable' : '🟢 Mark Available'}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className="flex-1 items-center py-2 rounded-lg bg-[#FF6B6B20] border border-[#FF6B6B]"
                                        onPress={() => deleteItem(item.id)}
                                    >
                                        <Text className="text-[#FF6B6B] text-xs font-bold">🗑️ Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
                <View className="h-20" />
            </ScrollView>

            {/* ── Add / Edit Modal ─────────────────────────────────────── */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    style={{ flex: 1, backgroundColor: '#000000CC' }}
                    onPress={() => setModalVisible(false)}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                >
                    <View style={{ backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderTopWidth: 1, borderColor: '#333', maxHeight: '90%' }}>
                        {/* Modal header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>
                                {editingId === null ? '➕ Add Menu Item' : '✏️ Edit Menu Item'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{ backgroundColor: '#2A2A2A', borderRadius: 20, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ color: '#A0A0A0', fontSize: 18 }}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                            {/* Name */}
                            <FormField
                                label="Item Name *"
                                placeholder="e.g. Spicy Chicken Sandwich"
                                value={form.name}
                                onChangeText={v => setForm(f => ({ ...f, name: v }))}
                                error={formErrors.name}
                            />

                            {/* Description */}
                            <FormField
                                label="Description *"
                                placeholder="Short description of the item"
                                value={form.description}
                                onChangeText={v => setForm(f => ({ ...f, description: v }))}
                                multiline
                                error={formErrors.description}
                            />

                            {/* Price */}
                            <FormField
                                label="Price ($) *"
                                placeholder="0.00"
                                value={String(form.price || '')}
                                onChangeText={v => setForm(f => ({ ...f, price: v as any }))}
                                keyboardType="decimal-pad"
                                error={formErrors.price}
                            />

                            {/* Image URL */}
                            <FormField
                                label="Image URL *"
                                placeholder="https://..."
                                value={form.image}
                                onChangeText={v => setForm(f => ({ ...f, image: v }))}
                                error={formErrors.image}
                            />

                            {/* Image preview */}
                            {!!form.image && (
                                <Image
                                    source={{ uri: form.image }}
                                    style={{ width: '100%', height: 140, borderRadius: 12, marginBottom: 16 }}
                                    resizeMode="cover"
                                />
                            )}

                            {/* Category picker */}
                            <Text style={{ color: '#A0A0A0', fontSize: 13, marginBottom: 8, fontWeight: '600' }}>Category *</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                                {CATEGORIES.map(cat => (
                                    <TouchableOpacity
                                        key={cat}
                                        onPress={() => setForm(f => ({ ...f, category: cat }))}
                                        style={{
                                            paddingHorizontal: 14, paddingVertical: 8,
                                            borderRadius: 20, marginRight: 8,
                                            backgroundColor: form.category === cat ? '#1DB954' : '#2A2A2A',
                                            borderWidth: 1,
                                            borderColor: form.category === cat ? '#1DB954' : '#444',
                                        }}
                                    >
                                        <Text style={{ color: form.category === cat ? '#000' : '#A0A0A0', fontWeight: '700', fontSize: 13 }}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Options */}
                            <FormField
                                label="Options (comma-separated)"
                                placeholder="e.g. Small, Medium, Large"
                                value={form.options ?? ''}
                                onChangeText={v => setForm(f => ({ ...f, options: v }))}
                            />

                            {/* Options preview chips */}
                            {!!(form.options ?? '').trim() && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, marginTop: -8, gap: 6 }}>
                                    {(form.options ?? '').split(',').map(o => o.trim()).filter(Boolean).map((o, i) => (
                                        <View key={i} style={{ backgroundColor: '#2A2A2A', borderWidth: 1, borderColor: '#444', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                                            <Text style={{ color: '#A0A0A0', fontSize: 12 }}>{o}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Availability toggle */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <Text style={{ color: '#A0A0A0', fontSize: 13, fontWeight: '600' }}>Available on menu</Text>
                                <TouchableOpacity
                                    onPress={() => setForm(f => ({ ...f, available: !f.available }))}
                                    style={{
                                        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                                        backgroundColor: form.available ? '#1DB95420' : '#FF6B6B20',
                                        borderWidth: 1,
                                        borderColor: form.available ? '#1DB954' : '#FF6B6B',
                                    }}
                                >
                                    <Text style={{ color: form.available ? '#1DB954' : '#FF6B6B', fontWeight: '700', fontSize: 13 }}>
                                        {form.available ? '✓ Available' : '✗ Unavailable'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Save button */}
                            <TouchableOpacity
                                onPress={saveItem}
                                style={{
                                    backgroundColor: '#1DB954', paddingVertical: 16,
                                    borderRadius: 14, alignItems: 'center', marginBottom: 32,
                                }}
                            >
                                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16 }}>
                                    {editingId === null ? '✓ Add to Menu' : '✓ Save Changes'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </SafeAreaView>
    );
}

/* ─── Reusable FormField ─────────────────────────────────────────────── */
function FormField({
    label, placeholder, value, onChangeText, multiline, keyboardType, error,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (v: string) => void;
    multiline?: boolean;
    keyboardType?: 'default' | 'decimal-pad';
    error?: string;
}) {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#A0A0A0', fontSize: 13, marginBottom: 6, fontWeight: '600' }}>{label}</Text>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#555"
                multiline={multiline}
                keyboardType={keyboardType ?? 'default'}
                style={{
                    backgroundColor: '#2A2A2A',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: error ? '#FF6B6B' : '#444',
                    color: '#fff',
                    padding: 12,
                    fontSize: 14,
                    minHeight: multiline ? 72 : undefined,
                    textAlignVertical: multiline ? 'top' : 'center',
                }}
            />
            {!!error && <Text style={{ color: '#FF6B6B', fontSize: 12, marginTop: 4 }}>{error}</Text>}
        </View>
    );
}
