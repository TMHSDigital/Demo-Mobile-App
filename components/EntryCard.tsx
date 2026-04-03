import { Pressable, View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { JournalEntry } from "../lib/types";

const COLUMN_GAP = 12;
const PADDING = 16;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = (SCREEN_WIDTH - PADDING * 2 - COLUMN_GAP) / 2;

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });
}

interface EntryCardProps {
  entry: JournalEntry;
}

export default function EntryCard({ entry }: EntryCardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/entry/${entry.id}`)}
      style={styles.card}
      accessibilityLabel={`Journal entry from ${formatDate(entry.createdAt)}`}
    >
      <Image
        source={{ uri: entry.photoUri }}
        style={styles.thumbnail}
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

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: COLUMN_GAP,
  },
  thumbnail: {
    width: "100%",
    height: CARD_WIDTH,
    backgroundColor: "#F3E8D8",
  },
  info: {
    padding: 10,
  },
  caption: {
    fontSize: 14,
    color: "#1F2937",
    lineHeight: 18,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  aiTag: {
    fontSize: 10,
    color: "#D97706",
    fontWeight: "700",
    marginTop: 4,
  },
});
