import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getEntry } from "../../lib/database";
import { useStore } from "../../lib/store";
import { JournalEntry } from "../../lib/types";
import { colors, spacing, radius, typography } from "../../constants/theme";
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
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(entry.photoUri);
      }
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
            color={colors.danger}
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
  container: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: colors.textSecondary, ...typography.body },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  topBarActions: { flexDirection: "row", gap: spacing.xs },
  content: { paddingBottom: spacing.xxxl },
  photo: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: colors.border,
  },
  details: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  caption: {
    fontSize: 18,
    color: colors.text,
    lineHeight: 26,
    marginBottom: spacing.lg,
  },
  aiSection: {
    backgroundColor: colors.accentLight,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  aiLabel: {
    ...typography.micro,
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  aiText: {
    ...typography.bodySmall,
    color: colors.accentDark,
    lineHeight: 20,
  },
});
