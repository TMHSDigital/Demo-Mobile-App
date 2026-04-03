import { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from "react-native";
import { CameraView, CameraType, FlashMode } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { requestCameraPermission } from "../../lib/permissions";
import PhotoPreview from "../../components/PhotoPreview";

export default function CameraScreen() {
  const cameraRef = useRef<CameraView>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      requestCameraPermission().then((granted) => {
        if (mounted) setHasPermission(granted);
      });
      return () => {
        mounted = false;
      };
    }, [])
  );

  const takePicture = async () => {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
    });
    if (photo) setPhotoUri(photo.uri);
  };

  if (photoUri) {
    return (
      <PhotoPreview
        photoUri={photoUri}
        onRetake={() => setPhotoUri(null)}
      />
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera access...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-off-outline" size={48} color="#9CA3AF" />
        <Text style={styles.message}>Camera access is required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity
              onPress={() => setFlash(flash === "off" ? "on" : "off")}
              style={styles.controlButton}
              accessibilityLabel={`Flash ${flash === "off" ? "on" : "off"}`}
            >
              <Ionicons
                name={flash === "off" ? "flash-off" : "flash"}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setFacing(facing === "back" ? "front" : "back")
              }
              style={styles.controlButton}
              accessibilityLabel="Flip camera"
            >
              <Ionicons name="camera-reverse-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomControls}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
              accessibilityLabel="Take photo"
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  message: { color: "#9CA3AF", fontSize: 16, marginTop: 12 },
  camera: { flex: 1, width: "100%" },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    alignItems: "center",
    paddingBottom: 32,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#fff",
  },
});
