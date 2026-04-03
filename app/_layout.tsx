import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initDatabase } from "../lib/database";
import { useStore } from "../lib/store";
import { configureNotificationHandler } from "../lib/notifications";
import ErrorBoundary from "../components/ErrorBoundary";
import LoadingSkeleton from "../components/LoadingSkeleton";

configureNotificationHandler();

function AppContent() {
  const [dbReady, setDbReady] = useState(false);
  const loadEntries = useStore((s) => s.loadEntries);

  useEffect(() => {
    (async () => {
      await initDatabase();
      await loadEntries();
      setDbReady(true);
    })();
  }, []);

  if (!dbReady) return <LoadingSkeleton />;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
