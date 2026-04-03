import { memo } from "react";
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { JournalEntry } from "../lib/types";
import { colors, spacing, radius, typography } from "../constants/theme";

const COLUMN_GAP = spacing.md;
const PADDING = spacing.lg;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

interface EntryCardProps {
  entry: JournalEntry;
}

function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - PADDING * 2 - COLUMN_GAP) / 2;

  return (
    <Pressable
      onPress={() => router.push(`/entry/${entry.id}`)}
      style={[styles.card, { width: cardWidth }]}
      accessibilityLabel={`Journal entry from ${formatDate(entry.createdAt)}`}
    >
      <Image
        source={{ uri: entry.photoUri }}
        style={[styles.thumbnail, { height: cardWidth }]}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.info}>
        {entry.caption ? (
          <Text style={styles.caption} numberOfLines={2}>
            {entry.caption}
          </Text>
        ) : null}
        <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>
        {entry.aiDescription ? (
          <Text style={styles.aiTag}>AI</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default memo(EntryCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: COLUMN_GAP,
  },
  thumbnail: {
    width: "100%",
    backgroundColor: colors.border,
  },
  info: {
    padding: spacing.sm + 2,
  },
  caption: {
    ...typography.bodySmall,
    color: colors.text,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  date: {
    ...typography.label,
    color: colors.textSecondary,
  },
  aiTag: {
    ...typography.tag,
    color: colors.accent,
    marginTop: spacing.xs,
  },
});
