import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Tool } from '../constants/tools';

export interface CartItem extends Tool {
  rentalDays: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (tool: Tool, days?: number) => void;
  removeFromCart: (toolId: string) => void;
  updateDays: (toolId: string, days: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalDeposit: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (tool: Tool, days = 1) => {
    setCart(prev => {
      if (prev.some(item => item.id === tool.id)) return prev;
      return [...prev, { ...tool, rentalDays: days }];
    });
  };

  const removeFromCart = (toolId: string) => {
    setCart(prev => prev.filter(item => item.id !== toolId));
  };

  const updateDays = (toolId: string, days: number) => {
    if (days < 1) return;
    setCart(prev => prev.map(item => item.id === toolId ? { ...item, rentalDays: days } : item));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + (item.pricePerDay * item.rentalDays), 0);
  const totalDeposit = cart.reduce((sum, item) => sum + item.deposit, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateDays, clearCart, totalPrice, totalDeposit }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
