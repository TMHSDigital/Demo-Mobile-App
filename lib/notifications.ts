import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

const REMINDER_ID = "snaplog-daily-reminder";

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return false;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("daily-reminder", {
      name: "Daily Reminder",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return true;
}

export async function scheduleDailyReminder(
  hour: number,
  minute: number
): Promise<void> {
  await cancelDailyReminder();

  await Notifications.scheduleNotificationAsync({
    identifier: REMINDER_ID,
    content: {
      title: "SnapLog",
      body: "Time to capture today's moment",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: Platform.OS === "android" ? "daily-reminder" : undefined,
    },
  });
}

export async function cancelDailyReminder(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(
    () => {}
  );
}

export function configureNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
