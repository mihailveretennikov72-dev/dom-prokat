import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="catalog" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="account" />
      <Tabs.Screen name="call" />
    </Tabs>
  );
}