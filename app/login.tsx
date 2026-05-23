import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView 
} from 'react-native';
import { signInCustomer } from '@/lib/auth';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleLogin = async () => {
    if (!name.trim() || !phone.trim()) {
      alert("Заполните все поля");
      return;
    }
    if (!agreed) {
      alert("Нужно согласие");
      return;
    }

    try {
      const result = await signInCustomer(name, phone);
      
      if (result.success) {
        // 1. Сохраняем имя в память браузера
        if (typeof window !== 'undefined') {
          localStorage.setItem('clientName', name);
        }
        
        // 2. Перебрасываем в каталог
        window.location.href = "/";
      } else {
        alert(result.error || "Ошибка входа");
      }
    } catch (e: any) {
      alert("Ошибка: " + e.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🛠</Text>
        <Text style={styles.title}>Дом Проката</Text>
        <Text style={styles.subtitle}>Аренда строительных инструментов</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Ваше имя</Text>
        <TextInput
          style={styles.input}
          placeholder="Иван"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Телефон</Text>
        <TextInput
          style={styles.input}
          placeholder="+7 (999) 123-45-67"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            Я согласен на обработку персональных данных
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Войти в каталог</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 40, alignItems: 'center', backgroundColor: '#f8f9fa', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  logo: { fontSize: 60, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  form: { padding: 30, flex: 1 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#f8f9fa', borderWidth: 1, borderColor: '#e9ecef', borderRadius: 12, padding: 15, fontSize: 16, color: '#333' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 30 },
  checkbox: { width: 24, height: 24, borderWidth: 2, borderColor: '#667eea', borderRadius: 6, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  checkboxActive: { backgroundColor: '#667eea', borderColor: '#667eea' },
  checkmark: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  checkboxLabel: { flex: 1, fontSize: 14, color: '#666', lineHeight: 18 },
  button: { backgroundColor: '#667eea', padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 20, shadowColor: '#667eea', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});