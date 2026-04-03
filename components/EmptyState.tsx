import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, spacing, typography, radius } from "../constants/theme";

export default function EmptyState() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="images-outline" size={64} color={colors.border} />
      <Text style={styles.title}>Your journal is empty</Text>
      <Text style={styles.subtitle}>
        Capture your first moment to start building your visual diary.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/camera")}
        style={styles.button}
        accessibilityLabel="Take your first photo"
      >
        <Ionicons name="camera" size={20} color={colors.white} />
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
    paddingHorizontal: spacing.xxxl,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
    ...typography.body,
  },
});
