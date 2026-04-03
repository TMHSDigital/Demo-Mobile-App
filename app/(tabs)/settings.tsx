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
import { colors, spacing, radius, typography } from "../../constants/theme";
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
                trackColor={{ true: colors.accent, false: "#E5E7EB" }}
                thumbColor={Platform.OS === "android" ? colors.white : undefined}
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
              <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
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
              <Ionicons name="open-outline" size={16} color={colors.textSecondary} />
            }
          />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxxl },
  header: {
    ...typography.h1,
    color: colors.text,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    ...typography.caption,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    marginBottom: 6,
  },
  sectionContent: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: { ...typography.body, color: colors.text, flex: 1 },
  rowValue: { ...typography.body, color: colors.textSecondary },
  timePicker: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: spacing.md,
    gap: spacing.sm,
  },
  timeOption: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
  },
  timeOptionActive: { backgroundColor: colors.accent },
  timeOptionText: { ...typography.caption, color: colors.text },
  timeOptionTextActive: { color: colors.white, fontWeight: "600" },
});
