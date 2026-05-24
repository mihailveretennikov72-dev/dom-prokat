import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '@/context/CartContext';

const TOCHKA_LINK = 'https://checkout.tochka.com/2c951a73-8323-472b-bc99-cc26ece6d8d8';

export default function CheckoutScreen() {
  const { cart, customerInfo, updateCustomerInfo, totalPrice, totalDeposit, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatPhone = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';
    if (cleaned.startsWith('7') || cleaned.startsWith('8')) {
      formatted = '+7';
      if (cleaned.length > 1) formatted += ` (${cleaned.slice(1, 4)}`;
      if (cleaned.length > 4) formatted += `) ${cleaned.slice(4, 7)}`;
      if (cleaned.length > 7) formatted += `-${cleaned.slice(7, 9)}`;
      if (cleaned.length > 9) formatted += `-${cleaned.slice(9, 11)}`;
    } else {
      formatted = text;
    }
    return formatted;
  };

  const validate = () => {
    if (!customerInfo.name.trim()) { Alert.alert('Ошибка', 'Введите ваше имя'); return false; }
    if (customerInfo.phone.replace(/\D/g, '').length < 11) { Alert.alert('Ошибка', 'Введите корректный номер телефона'); return false; }
    if (cart.length === 0) { Alert.alert('Ошибка', 'Корзина пуста'); router.push('/cart'); return false; }
    return true;
  };

  const handleCheckout = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const orderDraft = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        customer: customerInfo,
        items: cart.map(i => ({ id: i.id, name: i.name, days: i.startDate && i.endDate ? Math.ceil((new Date(i.endDate).getTime() - new Date(i.startDate).getTime()) / 86400000) + 1 : 0 })),
        total: totalPrice + totalDeposit,
        status: 'pending_payment'
      };

      const existing = JSON.parse(localStorage.getItem('domprokat_orders') || '[]');
      existing.push(orderDraft);
      localStorage.setItem('domprokat_orders', JSON.stringify(existing));

      clearCart();

      if (Platform.OS === 'web') {
        window.location.href = TOCHKA_LINK;
      } else {
        const { openURL } = await import('expo-linking');
        openURL(TOCHKA_LINK);
      }
    } catch (e) {
      Alert.alert('Ошибка', 'Не удалось сохранить заказ. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>📝 Оформление заказа</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Ваше имя</Text>
          <TextInput style={styles.input} placeholder="Иван Иванов" value={customerInfo.name} onChangeText={t => updateCustomerInfo({ name: t })} />

          <Text style={styles.label}>Телефон</Text>
          <TextInput style={styles.input} placeholder="+7 (999) 000-00-00" value={customerInfo.phone} onChangeText={t => updateCustomerInfo({ phone: formatPhone(t) })} keyboardType="phone-pad" />

          <Text style={styles.label}>Комментарий (необязательно)</Text>
          <TextInput style={[styles.input, styles.textArea]} placeholder="Время доставки, адрес, особые пожелания..." value={customerInfo.comment} onChangeText={t => updateCustomerInfo({ comment: t })} multiline numberOfLines={3} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>💳 К оплате</Text>
          <Text style={styles.summaryRow}>Аренда: {totalPrice} ₽</Text>
          <Text style={styles.summaryRow}>Залог: {totalDeposit} ₽</Text>
          <View style={styles.divider} />
          <Text style={styles.totalRow}>Итого: {totalPrice + totalDeposit} ₽</Text>
        </View>

        <TouchableOpacity style={[styles.payButton, loading && styles.payButtonDisabled]} onPress={handleCheckout} disabled={loading}>
          <Text style={styles.payButtonText}>{loading ? 'Обработка...' : 'Оплатить через Точку'}</Text>
        </TouchableOpacity>

        <Text style={styles.note}>После оплаты менеджер свяжется с вами для подтверждения доставки.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 10 },
  input: { backgroundColor: '#f1f3f5', borderWidth: 1, borderColor: '#dee2e6', borderRadius: 10, padding: 14, fontSize: 16 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  summaryRow: { fontSize: 16, marginBottom: 6 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 10 },
  totalRow: { fontSize: 22, fontWeight: 'bold', color: '#000' },
  payButton: { backgroundColor: '#667eea', paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 12 },
  payButtonDisabled: { opacity: 0.6 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  note: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 18 },
});