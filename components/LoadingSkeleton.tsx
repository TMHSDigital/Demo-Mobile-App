import { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { colors, spacing, radius } from "../constants/theme";

export default function LoadingSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, styles.header, { opacity }]} />
      <View style={styles.grid}>
        {[0, 1, 2, 3].map((i) => (
          <Animated.View key={i} style={[styles.card, { opacity }]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: 60,
  },
  bar: {
    backgroundColor: colors.border,
    borderRadius: radius.sm,
  },
  header: {
    width: 120,
    height: 28,
    marginBottom: spacing.xl,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  card: {
    width: "47%",
    aspectRatio: 0.85,
    backgroundColor: colors.border,
    borderRadius: radius.md,
  },
});
