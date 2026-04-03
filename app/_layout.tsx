import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { initDatabase } from "../lib/database";
import { useStore } from "../lib/store";

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const loadEntries = useStore((s) => s.loadEntries);

  useEffect(() => {
    (async () => {
      await initDatabase();
      await loadEntries();
      setDbReady(true);
    })();
  }, []);

  if (!dbReady) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
