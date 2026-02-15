import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    restaurantId: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: any, restaurantId: number) => void;
    addMultipleToCart: (items: any[], restaurantId: number) => void;
    removeFromCart: (itemId: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (product: any, restaurantId: number) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1, restaurantId }];
        });
    };

    const addMultipleToCart = (products: any[], restaurantId: number) => {
        setItems((prev) => {
            const newItems = [...prev];
            products.forEach((product) => {
                const existing = newItems.find((i) => i.id === product.id);
                if (existing) {
                    existing.quantity += product.quantity || 1;
                } else {
                    newItems.push({ ...product, quantity: product.quantity || 1, restaurantId });
                }
            });
            return newItems;
        });
    };

    const removeFromCart = (itemId: number) => {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, addMultipleToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};
