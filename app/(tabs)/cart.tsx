import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform, TextInput } from 'react-native';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'expo-router';

const DateInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{label}</Text>
        {/* @ts-ignore: native web input */}
        <input type="date" value={value} onChange={e => onChange(e.target.value)} style={styles.webDateInput} />
      </View>
    );
  }
  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} placeholder="ГГГГ-ММ-ДД" keyboardType="numeric" />
    </View>
  );
};

export default function CartScreen() {
  const { cart, removeFromCart, updateDates, totalPrice, totalDeposit, getDays } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Корзина пуста</Text>
          <Text style={styles.emptyText}>Добавьте инструменты из каталога</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/catalog')}>
            <Text style={styles.buttonText}>Перейти в каталог</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>🛒 Корзина ({cart.length})</Text>

        {cart.map(item => {
          const days = getDays(item.startDate, item.endDate);
          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.toolName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.removeBtn}>
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.toolModel}>{item.model || 'Аренда инструмента'}</Text>
              <Text style={styles.priceLine}>Залог: {item.deposit} ₽</Text>

              <View style={styles.datesRow}>
                <DateInput label="С" value={item.startDate} onChange={d => updateDates(item.id, d, item.endDate)} />
                <DateInput label="По" value={item.endDate} onChange={d => updateDates(item.id, item.startDate, d)} />
              </View>

              <View style={styles.calcRow}>
                <Text style={styles.calcText}>📅 {days} дн. × {item.pricePerDay} ₽</Text>
                <Text style={styles.calcTotal}>= {item.pricePerDay * days} ₽</Text>
              </View>
            </View>
          );
        })}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryRow}>💰 Аренда: {totalPrice} ₽</Text>
          <Text style={styles.summaryRow}>🔒 Залог: {totalDeposit} ₽</Text>
          <View style={styles.divider} />
          <Text style={styles.totalRow}>Итого к оплате: {totalPrice + totalDeposit} ₽</Text>
        </View>

        <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 20 },
  button: { backgroundColor: '#667eea', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  toolName: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  removeBtn: { padding: 8 },
  removeText: { fontSize: 18, color: '#ff3b30' },
  toolModel: { fontSize: 14, color: '#888', marginBottom: 8 },
  priceLine: { fontSize: 14, fontWeight: '500', color: '#007AFF', marginBottom: 12 },
  datesRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  inputWrapper: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', color: '#555', marginBottom: 4 },
  input: { backgroundColor: '#f1f3f5', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 8, padding: 10, fontSize: 14 },
  webDateInput: { width: '100%', padding: '10px', fontSize: '14px', borderRadius: '8px', border: '1px solid #dee2e6', backgroundColor: '#f1f3f5', outline: 'none' },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  calcText: { fontSize: 14, color: '#555' },
  calcTotal: { fontSize: 16, fontWeight: 'bold', color: '#34C759' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginTop: 8, marginBottom: 16 },
  summaryRow: { fontSize: 16, marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalRow: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  checkoutButton: { backgroundColor: '#34C759', paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});