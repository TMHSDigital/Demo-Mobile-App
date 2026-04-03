import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { initDatabase } from "../lib/database";
import { useStore } from "../lib/store";
import { configureNotificationHandler } from "../lib/notifications";
import { colors, spacing, typography, radius } from "../constants/theme";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSkeleton from "../components/LoadingSkeleton";

configureNotificationHandler();

function InitError({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={initStyles.container}>
      <Ionicons name="alert-circle-outline" size={56} color={colors.danger} />
      <Text style={initStyles.title}>Failed to load data</Text>
      <Text style={initStyles.subtitle}>
        The database could not be initialized.
      </Text>
      <TouchableOpacity onPress={onRetry} style={initStyles.button}>
        <Text style={initStyles.buttonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const initStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  buttonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: "600",
  },
});

function AppContent() {
  const [dbReady, setDbReady] = useState(false);
  const [initFailed, setInitFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const loadEntries = useStore((s) => s.loadEntries);
  const loadSettings = useStore((s) => s.loadSettings);

  useEffect(() => {
    let cancelled = false;
    setInitFailed(false);
    setDbReady(false);
    (async () => {
      try {
        await initDatabase();
        await Promise.all([loadEntries(), loadSettings()]);
        if (!cancelled) setDbReady(true);
      } catch {
        if (!cancelled) setInitFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadEntries, loadSettings, attempt]);

  if (initFailed)
    return <InitError onRetry={() => setAttempt((a) => a + 1)} />;
  if (!dbReady) return <LoadingSkeleton />;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
