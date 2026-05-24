import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  return (
    <CartProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="tool/[id]" options={{ presentation: 'modal' }} />
        <Stack.Screen name="cart" options={{ presentation: 'modal' }} />
      </Stack>
    </CartProvider>
  );
}
