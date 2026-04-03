import { useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useStore } from "../../lib/store";
import { JournalEntry } from "../../lib/types";
import { colors, spacing, typography } from "../../constants/theme";
import EntryCard from "../../components/EntryCard";
import EmptyState from "../../components/EmptyState";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function JournalScreen() {
  const entries = useStore((s) => s.entries);
  const loadEntries = useStore((s) => s.loadEntries);
  const prevCount = useRef(entries.length);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  useEffect(() => {
    if (prevCount.current !== entries.length) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      prevCount.current = entries.length;
    }
  }, [entries.length]);

  if (entries.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SnapLog</Text>
      </View>
      <FlatList<JournalEntry>
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <EntryCard entry={item} />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        onRefresh={loadEntries}
        refreshing={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: "space-between",
  },
});
