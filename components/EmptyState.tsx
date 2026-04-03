import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function EmptyState() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="images-outline" size={64} color="#D4C5A9" />
      <Text style={styles.title}>Your journal is empty</Text>
      <Text style={styles.subtitle}>
        Capture your first moment to start building your visual diary.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/camera")}
        style={styles.button}
        accessibilityLabel="Take your first photo"
      >
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={styles.buttonText}>Take your first photo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D97706",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
