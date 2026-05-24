import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Tool } from '../constants/tools';

export interface CartItem extends Tool {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface CustomerInfo {
  name: string;
  phone: string;
  comment: string;
}

interface CartContextType {
  cart: CartItem[];
  customerInfo: CustomerInfo;
  addToCart: (tool: Tool) => void;
  removeFromCart: (toolId: string) => void;
  updateDates: (toolId: string, startDate: string, endDate: string) => void;
  updateCustomerInfo: (info: Partial<CustomerInfo>) => void;
  clearCart: () => void;
  totalPrice: number;
  totalDeposit: number;
  getDays: (start: string, end: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateDays = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
  const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : 0;
};

// Безопасный доступ к localStorage для static export
const safeStorage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try { return localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try { localStorage.setItem(key, value); } catch { /* ignore */ }
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', phone: '', comment: '' });

  // Загрузка при монтировании
  useEffect(() => {
    const savedCart = safeStorage.get('domprokat_cart');
    const savedInfo = safeStorage.get('domprokat_customer');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedInfo) setCustomerInfo(JSON.parse(savedInfo));
  }, []);

  // Сохранение при изменении
  useEffect(() => {
    safeStorage.set('domprokat_cart', JSON.stringify(cart));
    safeStorage.set('domprokat_customer', JSON.stringify(customerInfo));
  }, [cart, customerInfo]);

  const addToCart = (tool: Tool) => {
    setCart(prev => {
      if (prev.some(item => item.id === tool.id)) return prev;
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return [...prev, {
        ...tool,
        startDate: today.toISOString().split('T')[0],
        endDate: tomorrow.toISOString().split('T')[0]
      }];
    });
  };

  const removeFromCart = (toolId: string) => setCart(prev => prev.filter(i => i.id !== toolId));

  const updateDates = (toolId: string, startDate: string, endDate: string) => {
    setCart(prev => prev.map(i => i.id === toolId ? { ...i, startDate, endDate } : i));
  };

  const updateCustomerInfo = (info: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...info }));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '', comment: '' });
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.pricePerDay * calculateDays(item.startDate, item.endDate)), 0);
  const totalDeposit = cart.reduce((sum, item) => sum + item.deposit, 0);

  return (
    <CartContext.Provider value={{
      cart, customerInfo, addToCart, removeFromCart, updateDates,
      updateCustomerInfo, clearCart, totalPrice, totalDeposit, getDays: calculateDays
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};