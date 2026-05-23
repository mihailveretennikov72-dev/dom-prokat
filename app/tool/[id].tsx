import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { tools } from "../../constants/tools";
import { useCart } from "../../context/CartContext";

export default function ToolDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();

  const tool = tools.find((item) => String(item.id) === String(id));

  if (!tool) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Товар не найден</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    console.log("ADD:", tool);

    addToCart({
      id: String(tool.id),
      title: tool.title,
      subtitle: tool.subtitle,
      pricePerDay: tool.pricePerDay,
      deposit: tool.deposit,
    });

    Alert.alert("OK", "Добавлено в корзину");

    router.push("/(tabs)/cart");
  };

  return (
    <ScrollView style={{ padding: 16 }}>
      <View
        style={{
          height: 200,
          backgroundColor: "#eee",
          borderRadius: 12,
          marginBottom: 16,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Фото</Text>
      </View>

      <Text style={{ fontSize: 24, fontWeight: "700" }}>{tool.title}</Text>

      <Text style={{ color: "#666", marginTop: 6 }}>
        {tool.subtitle}
      </Text>

      <Text style={{ fontSize: 22, fontWeight: "700", marginTop: 12 }}>
        {tool.pricePerDay} ₽ / день
      </Text>

      <Text style={{ color: "#666", marginTop: 4 }}>
        Залог: {tool.deposit} ₽
      </Text>

      <Text style={{ marginTop: 16 }}>
        {tool.description}
      </Text>

      <Pressable
        onPress={handleAddToCart}
        style={{
          marginTop: 24,
          backgroundColor: "#111",
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          Добавить в корзину
        </Text>
      </Pressable>
    </ScrollView>
  );
}