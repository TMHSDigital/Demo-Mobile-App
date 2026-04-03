import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  Share,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getEntry } from "../../lib/database";
import { useStore } from "../../lib/store";
import { JournalEntry } from "../../lib/types";
import IconButton from "../../components/IconButton";

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const removeEntry = useStore((s) => s.removeEntry);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getEntry(id).then(setEntry);
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert("Delete Entry", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!id) return;
          await removeEntry(id);
          router.back();
        },
      },
    ]);
  };

  const handleShare = async () => {
    if (!entry) return;
    try {
      await Share.share({
        message: entry.caption || "Check out my SnapLog entry!",
      });
    } catch {
      // user cancelled
    }
  };

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <IconButton
          name="arrow-back"
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        />
        <View style={styles.topBarActions}>
          <IconButton
            name="share-outline"
            onPress={handleShare}
            accessibilityLabel="Share entry"
          />
          <IconButton
            name="trash-outline"
            color="#EF4444"
            onPress={handleDelete}
            accessibilityLabel="Delete entry"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: entry.photoUri }}
          style={styles.photo}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.details}>
          <Text style={styles.date}>{formatDateTime(entry.createdAt)}</Text>

          {entry.caption ? (
            <Text style={styles.caption}>{entry.caption}</Text>
          ) : null}

          {entry.aiDescription ? (
            <View style={styles.aiSection}>
              <Text style={styles.aiLabel}>AI-generated description</Text>
              <Text style={styles.aiText}>{entry.aiDescription}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF5" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#9CA3AF", fontSize: 16 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  topBarActions: { flexDirection: "row", gap: 4 },
  content: { paddingBottom: 40 },
  photo: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#F3E8D8",
  },
  details: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  date: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  caption: {
    fontSize: 18,
    color: "#1F2937",
    lineHeight: 26,
    marginBottom: 16,
  },
  aiSection: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  aiLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#D97706",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  aiText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
  },
});
