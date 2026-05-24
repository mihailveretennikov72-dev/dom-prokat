import React, { useState } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  SafeAreaView, TextInput, ScrollView 
} from 'react-native';
import { useRouter } from 'expo-router';
import { tools } from '../constants/tools';
import { useCart } from '../context/CartContext';

const categories = ['Все', ...Array.from(new Set(tools.map(t => t.category)))];

export default function CatalogScreen() {
  const router = useRouter();
  const { cart, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (tool.characteristics?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory = selectedCategory === 'Все' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderTool = ({ item }: { item: typeof tools[0] }) => {
    const isInCart = cart.some(c => c.id === item.id);
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => router.push(`/tool/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
          <Text style={styles.quantity}>×{item.quantity}</Text>
        </View>
        
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.brand}>{item.brand}</Text>
        
        <View style={styles.row}>
          <View>
            <Text style={styles.price}>{item.pricePerDay} ₽<Text style={styles.perDay}>/день</Text></Text>
            <Text style={styles.deposit}>Залог: {item.deposit.toLocaleString()} ₽</Text>
          </View>
          <TouchableOpacity
            style={[styles.btn, isInCart && styles.btnAdded]}
            onPress={(e) => {
              e.stopPropagation();
              !isInCart && addToCart(item);
            }}
            disabled={isInCart}
          >
            <Text style={styles.btnText}>{isInCart ? '✓' : '+'}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>🔧 Дом Прокат</Text>
          <TouchableOpacity 
            style={styles.cartBtn} 
            onPress={() => router.push('/cart')}
          >
            <Text style={styles.cartText}>🛒 {cart.length}</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск инструментов..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryBtn, selectedCategory === cat && styles.categoryBtnActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredTools}
        keyExtractor={item => item.id}
        renderItem={renderTool}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Ничего не найдено 😔</Text>
            <Text style={styles.emptySub}>Попробуйте изменить запрос</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0F' },
  header: { backgroundColor: '#0A0A0F', padding: 16, borderBottomWidth: 1, borderBottomColor: '#1A1A2E' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  cartBtn: { 
    backgroundColor: '#1A1A2E', 
    borderWidth: 1, 
    borderColor: '#FF6B35',
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  cartText: { color: '#FF6B35', fontWeight: 'bold', fontSize: 16 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 12 },
  categoriesScroll: { backgroundColor: '#0A0A0F', maxHeight: 50 },
  categoriesContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  categoryBtn: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20,
    backgroundColor: '#1A1A2E',
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  categoryBtnActive: { 
    backgroundColor: '#FF6B35', 
    borderColor: '#FF6B35' 
  },
  categoryText: { color: '#A0A0B0', fontSize: 14, fontWeight: '500' },
  categoryTextActive: { color: '#fff', fontWeight: 'bold' },
  list: { padding: 16 },
  card: { 
    backgroundColor: '#1A1A2E', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A4A',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  badge: { 
    backgroundColor: '#0A0A0F', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#00D4FF',
  },
  badgeText: { color: '#00D4FF', fontSize: 12, fontWeight: '600' },
  quantity: { color: '#A0A0B0', fontSize: 12 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  brand: { fontSize: 14, color: '#666', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 20, fontWeight: 'bold', color: '#00D4FF' },
  perDay: { fontSize: 14, fontWeight: 'normal', color: '#666' },
  deposit: { fontSize: 12, color: '#FF6B35', marginTop: 2 },
  btn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#FF6B35',
    justifyContent: 'center', 
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  btnAdded: { backgroundColor: '#27ae60', shadowColor: '#27ae60' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 24 },
  empty: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  emptySub: { fontSize: 14, color: '#666', marginTop: 8 },
});
