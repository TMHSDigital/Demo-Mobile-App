import { useCallback } from "react";
import { FlatList, StyleSheet, SafeAreaView, View, Text } from "react-native";
import { useFocusEffect } from "expo-router";
import { useStore } from "../../lib/store";
import { JournalEntry } from "../../lib/types";
import EntryCard from "../../components/EntryCard";
import EmptyState from "../../components/EmptyState";

export default function JournalScreen() {
  const entries = useStore((s) => s.entries);
  const loadEntries = useStore((s) => s.loadEntries);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

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
  container: { flex: 1, backgroundColor: "#FFFBF5" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
});
