import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import { useStore } from "../lib/store";

interface PhotoPreviewProps {
  photoUri: string;
  onRetake: () => void;
}

export default function PhotoPreview({ photoUri, onRetake }: PhotoPreviewProps) {
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  const addEntry = useStore((s) => s.addEntry);
  const router = useRouter();

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
          placeholderTextColor="#9CA3AF"
          value={caption}
          onChangeText={setCaption}
          maxLength={280}
          multiline
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={onRetake}
            style={[styles.button, styles.retakeButton]}
            accessibilityLabel="Retake photo"
          >
            <Text style={styles.retakeText}>Retake</Text>
          </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: "#000" },
  photo: { flex: 1, width: "100%" },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  captionInput: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    maxHeight: 100,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  retakeButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  saveButton: {
    backgroundColor: "#D97706",
  },
  retakeText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
