import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../context/CartContext';

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, updateDays, totalPrice, totalDeposit } = useCart();
  const total = totalPrice + totalDeposit;

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Корзина</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>🛒 Корзина пуста</Text>
          <Text style={styles.emptySub}>Добавьте инструменты из каталога</Text>
          <TouchableOpacity style={styles.catalogBtn} onPress={() => router.push('/')}>
            <Text style={styles.catalogBtnText}>Перейти в каталог</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Корзина ({cart.length})</Text>
      </View>

      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.brand}>{item.brand}</Text>
              <Text style={styles.calc}>{item.pricePerDay} ₽ × {item.rentalDays} дн. = {(item.pricePerDay * item.rentalDays).toLocaleString()} ₽</Text>
              <Text style={styles.depositText}>Залог: {item.deposit.toLocaleString()} ₽</Text>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity onPress={() => updateDays(item.id, item.rentalDays - 1)} style={styles.ctrlBtn}>
                <Text style={styles.ctrlText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.days}>{item.rentalDays}</Text>
              <TouchableOpacity onPress={() => updateDays(item.id, item.rentalDays + 1)} style={styles.ctrlBtn}>
                <Text style={styles.ctrlText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.delBtn}>
                <Text style={styles.delText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.row}>
          <Text style={styles.label}>Аренда:</Text>
          <Text style={styles.value}>{totalPrice.toLocaleString()} ₽</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Залог:</Text>
          <Text style={styles.value}>{totalDeposit.toLocaleString()} ₽</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Итого:</Text>
          <Text style={styles.totalValue}>{total.toLocaleString()} ₽</Text>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={() => alert('Раздел в разработке!')}>
          <Text style={styles.orderBtnText}>Оформить заказ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  backBtn: { marginRight: 16 },
  backText: { color: '#00D4FF', fontSize: 24, fontWeight: 'bold' },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 48, marginBottom: 16 },
  emptySub: { fontSize: 18, color: '#666', marginBottom: 32, textAlign: 'center' },
  catalogBtn: { backgroundColor: '#00D4FF', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 12 },
  catalogBtnText: { color: '#000', fontWeight: 'bold', fontSize: 16 },
  list: { padding: 16 },
  item: { backgroundColor: '#1A1A2E', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1, marginRight: 12 },
  name: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  brand: { color: '#888', fontSize: 13, marginBottom: 6 },
  calc: { color: '#00D4FF', fontSize: 14, marginBottom: 2 },
  depositText: { color: '#FF6B35', fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center' },
  ctrlBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginHorizontal: 4 },
  ctrlText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  days: { color: '#fff', width: 32, textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginHorizontal: 8 },
  delBtn: { marginLeft: 8, padding: 6 },
  delText: { color: '#FF3366', fontSize: 20, fontWeight: 'bold' },
  footer: { padding: 20, backgroundColor: '#111', borderTopWidth: 1, borderTopColor: '#333' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#888', fontSize: 16 },
  value: { color: '#fff', fontSize: 16, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#333', paddingTop: 12, marginTop: 4, marginBottom: 16 },
  totalLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  totalValue: { color: '#00D4FF', fontSize: 22, fontWeight: 'bold' },
  orderBtn: { backgroundColor: '#00D4FF', padding: 18, borderRadius: 12, alignItems: 'center' },
  orderBtnText: { color: '#000', fontWeight: 'bold', fontSize: 18 },
});
