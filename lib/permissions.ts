import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Alert, Linking } from "react-native";

export async function requestCameraPermission(): Promise<boolean> {
  const { status, canAskAgain } = await Camera.requestCameraPermissionsAsync();
  if (status === "granted") return true;

  if (!canAskAgain) {
    Alert.alert(
      "Camera Access Required",
      "Open Settings to allow camera access for SnapLog.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  }
  return false;
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status, canAskAgain } =
    await MediaLibrary.requestPermissionsAsync();
  if (status === "granted") return true;

  if (!canAskAgain) {
    Alert.alert(
      "Photo Library Access Required",
      "Open Settings to allow photo library access for SnapLog.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => Linking.openSettings() },
      ]
    );
  }
  return false;
}
