import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function RentalScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [tool, setTool] = useState<any>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [days, setDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    loadTool();
    checkUser();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [startDate, endDate, tool]);

  const loadTool = async () => {
    const { data } = await supabase
      .from('tools')
      .select('*')
      .eq('id', id)
      .single();
    if (data) setTool(data);
  };

  const checkUser = () => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('clientId');
      if (id) setCustomerId(parseInt(id));
    }
  };

  const calculatePrice = () => {
    if (!startDate || !endDate || !tool) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    if (diffDays > 0) {
      setDays(diffDays);
      setTotalPrice(diffDays * (tool.rental_price || 500));
    }
  };

  const handleRent = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Ошибка', 'Выберите даты аренды');
      return;
    }
    if (!customerId) {
      Alert.alert('Ошибка', 'Сначала войдите в систему');
      router.push('/login');
      return;
    }

    try {
      const { error } = await supabase.from('orders').insert({
        customer_id: customerId,
        tool_id: parseInt(id as string),
        start_date: startDate,
        end_date: endDate,
        total_days: days,
        total_price: totalPrice,
        status: 'pending',
      });

      if (error) throw error;

      Alert.alert(
        '✅ Заказ создан!',
        `Дней: ${days}\nСумма: ${totalPrice} ₽`,
        [{ text: 'Отлично', onPress: () => router.push('/') }]
      );
    } catch (e: any) {
      Alert.alert('Ошибка', e.message);
    }
  };

  if (!tool) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Загрузка...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>🛠 Оформление аренды</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.toolName}>{tool.name}</Text>
            <Text style={styles.toolModel}>{tool.model}</Text>
            <Text style={styles.price}>Залог: {tool.deposit} ₽</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Дата начала</Text>
            <TextInput
              style={styles.input}
              placeholder="ДД.ММ.ГГГГ"
              value={startDate}
              onChangeText={setStartDate}
            />

            <Text style={styles.label}>Дата окончания</Text>
            <TextInput
              style={styles.input}
              placeholder="ДД.ММ.ГГГГ"
              value={endDate}
              onChangeText={setEndDate}
            />

            {days > 0 && (
              <View style={styles.calculation}>
                <Text style={styles.total}>💰 Итого: {totalPrice} ₽</Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRent}>
            <Text style={styles.buttonText}>Оформить аренду</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scroll: { flex: 1 },
  header: { padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  content: { padding: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 },
  toolName: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  toolModel: { fontSize: 16, color: '#888', marginBottom: 12 },
  price: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', borderRadius: 12, padding: 15, fontSize: 16 },
  calculation: { marginTop: 20, padding: 15, backgroundColor: '#f0f8ff', borderRadius: 12 },
  total: { fontSize: 20, fontWeight: 'bold', color: '#34C759' },
  button: { backgroundColor: '#667eea', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});