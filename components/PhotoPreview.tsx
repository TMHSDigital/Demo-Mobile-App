import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "../lib/store";
import { isAIEnabled, describePhoto } from "../lib/ai";
import { colors, spacing, radius } from "../constants/theme";

interface PhotoPreviewProps {
  photoUri: string;
  onRetake: () => void;
}

export default function PhotoPreview({ photoUri, onRetake }: PhotoPreviewProps) {
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDescription, setAiDescription] = useState<string | null>(null);
  const addEntry = useStore((s) => s.addEntry);
  const router = useRouter();

  const handleAIDescribe = async () => {
    setAiLoading(true);
    const description = await describePhoto(photoUri);
    setAiDescription(description);
    setAiLoading(false);
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);

    try {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      const ext = photoUri.split(".").pop() || "jpg";
      const destDir = `${FileSystem.documentDirectory}photos/`;
      await FileSystem.makeDirectoryAsync(destDir, { intermediates: true });
      const destUri = `${destDir}${id}.${ext}`;
      await FileSystem.copyAsync({ from: photoUri, to: destUri });

      await addEntry({
        id,
        photoUri: destUri,
        caption: caption.trim(),
        aiDescription: aiDescription ?? undefined,
        createdAt: new Date().toISOString(),
      });

      router.replace("/(tabs)");
    } catch {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Image source={{ uri: photoUri }} style={styles.photo} contentFit="cover" />

      <View style={styles.controls}>
        <TextInput
          style={styles.captionInput}
          placeholder="Add a caption..."
          placeholderTextColor={colors.textSecondary}
          value={caption}
          onChangeText={setCaption}
          maxLength={280}
          multiline
        />

        {aiDescription ? (
          <View style={styles.aiPreview}>
            <Text style={styles.aiLabel}>AI Description</Text>
            <Text style={styles.aiText}>{aiDescription}</Text>
          </View>
        ) : null}

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={onRetake}
            style={[styles.button, styles.retakeButton]}
            accessibilityLabel="Retake photo"
          >
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>

          {isAIEnabled() && !aiDescription ? (
            <TouchableOpacity
              onPress={handleAIDescribe}
              style={[styles.button, styles.aiButton]}
              disabled={aiLoading}
              accessibilityLabel="Generate AI description"
            >
              {aiLoading ? (
                <ActivityIndicator color={colors.accent} size="small" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color={colors.accent} />
                  <Text style={styles.aiButtonText}>AI Describe</Text>
                </>
              )}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            onPress={handleSave}
            style={[styles.button, styles.saveButton]}
            disabled={saving}
            accessibilityLabel="Save entry"
          >
            <Text style={styles.saveText}>
              {saving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black },
  photo: { flex: 1, width: "100%" },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingBottom: 40,
    paddingTop: spacing.lg,
    backgroundColor: colors.overlay,
  },
  captionInput: {
    backgroundColor: colors.cameraControlBg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.white,
    fontSize: 16,
    marginBottom: spacing.lg,
    maxHeight: 100,
  },
  buttons: {
    flexDirection: "row",
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: "center",
  },
  retakeButton: {
    backgroundColor: colors.cameraControlBg,
  },
  saveButton: {
    backgroundColor: colors.accent,
  },
  retakeText: { color: colors.white, fontWeight: "600", fontSize: 16 },
  aiButton: {
    backgroundColor: colors.cameraControlBg,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
  },
  aiButtonText: { color: colors.accent, fontWeight: "600", fontSize: 14 },
  aiPreview: {
    backgroundColor: "rgba(254,243,199,0.2)",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  aiLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  aiText: { fontSize: 13, color: colors.white, lineHeight: 18 },
  saveText: { color: colors.white, fontWeight: "600", fontSize: 16 },
});
