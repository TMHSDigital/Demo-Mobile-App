import { useState } from "react";
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Linking,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../lib/store";
import {
  scheduleDailyReminder,
  cancelDailyReminder,
  registerForPushNotifications,
} from "../../lib/notifications";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function Row({
  label,
  value,
  onPress,
  right,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container onPress={onPress} style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      {right ?? (value ? <Text style={styles.rowValue}>{value}</Text> : null)}
    </Container>
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function SettingsScreen() {
  const entries = useStore((s) => s.entries);
  const settings = useStore((s) => s.settings);
  const updateSettings = useStore((s) => s.updateSettings);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const version = Constants.expoConfig?.version ?? "0.1.0";
  const [hour, minute] = settings.reminderTime.split(":").map(Number);

  const toggleReminder = async (enabled: boolean) => {
    if (enabled) {
      await registerForPushNotifications();
      await scheduleDailyReminder(hour, minute);
    } else {
      await cancelDailyReminder();
    }
    updateSettings({ reminderEnabled: enabled });
  };

  const setReminderHour = async (h: number) => {
    const time = `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    updateSettings({ reminderTime: time });
    if (settings.reminderEnabled) {
      await scheduleDailyReminder(h, minute);
    }
    setShowTimePicker(false);
  };

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.header}>Settings</Text>

        <Section title="Journal">
          <Row
            label="Entries"
            value={`${entries.length} ${entries.length === 1 ? "entry" : "entries"}`}
          />
        </Section>

        <Section title="Reminders">
          <Row
            label="Daily reminder"
            right={
              <Switch
                value={settings.reminderEnabled}
                onValueChange={toggleReminder}
                trackColor={{ true: "#D97706", false: "#E5E7EB" }}
                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
              />
            }
          />
          {settings.reminderEnabled ? (
            <Row
              label="Time"
              value={formatTime(hour, minute)}
              onPress={() => setShowTimePicker(!showTimePicker)}
            />
          ) : null}
          {showTimePicker ? (
            <View style={styles.timePicker}>
              {HOURS.map((h) => (
                <TouchableOpacity
                  key={h}
                  onPress={() => setReminderHour(h)}
                  style={[
                    styles.timeOption,
                    h === hour && styles.timeOptionActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      h === hour && styles.timeOptionTextActive,
                    ]}
                  >
                    {formatTime(h, 0)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </Section>

        <Section title="About">
          <Row label="Version" value={version} />
          <Row
            label="Built with Mobile App Developer Tools"
            onPress={() =>
              Linking.openURL(
                "https://github.com/TMHSDigital/Mobile-App-Developer-Tools"
              )
            }
            right={
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            }
          />
          <Row
            label="View source"
            onPress={() =>
              Linking.openURL(
                "https://github.com/TMHSDigital/Demo-Mobile-App"
              )
            }
            right={
              <Ionicons name="open-outline" size={16} color="#9CA3AF" />
            }
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBF5" },
  scroll: { paddingBottom: 40 },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionContent: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#F3E8D8",
  },
  rowLabel: { fontSize: 16, color: "#1F2937", flex: 1 },
  rowValue: { fontSize: 16, color: "#9CA3AF" },
  timePicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F9F5EB",
  },
  timeOptionActive: { backgroundColor: "#D97706" },
  timeOptionText: { fontSize: 13, color: "#1F2937" },
  timeOptionTextActive: { color: "#fff", fontWeight: "600" },
});
