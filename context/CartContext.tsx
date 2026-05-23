import React, { createContext, useContext, useState } from "react";

export type CartItem = {
  id: string;
  title: string;
  subtitle: string;
  pricePerDay: number;
  deposit: number;
  days: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "days">) => void;
  removeFromCart: (id: string) => void;
  increaseDays: (id: string) => void;
  decreaseDays: (id: string) => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseDays: () => {},
  decreaseDays: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, "days">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, days: i.days + 1 } : i
        );
      }

      return [...prev, { ...item, days: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const increaseDays = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, days: i.days + 1 } : i
      )
    );
  };

  const decreaseDays = (id: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.days > 1
          ? { ...i, days: i.days - 1 }
          : i
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseDays,
        decreaseDays,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);