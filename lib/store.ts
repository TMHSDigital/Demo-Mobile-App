import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import * as FileSystem from "expo-file-system/legacy";
import { JournalEntry, AppSettings } from "./types";
import {
  getAllEntries,
  insertEntry,
  getEntry,
  deleteEntry as dbDeleteEntry,
} from "./database";

const SETTINGS_KEY = "snaplog_settings";

const DEFAULT_SETTINGS: AppSettings = {
  reminderEnabled: false,
  reminderTime: "20:00",
};

async function persistSettings(settings: AppSettings): Promise<void> {
  await SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(settings));
}

async function loadPersistedSettings(): Promise<AppSettings> {
  const raw = await SecureStore.getItemAsync(SETTINGS_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

interface StoreState {
  entries: JournalEntry[];
  settings: AppSettings;
  loadEntries: () => Promise<void>;
  loadSettings: () => Promise<void>;
  addEntry: (entry: JournalEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

export const useStore = create<StoreState>((set, get) => ({
  entries: [],
  settings: DEFAULT_SETTINGS,

  loadEntries: async () => {
    const entries = await getAllEntries();
    set({ entries });
  },

  loadSettings: async () => {
    const settings = await loadPersistedSettings();
    set({ settings });
  },

  addEntry: async (entry) => {
    await insertEntry(entry);
    set((s) => ({ entries: [entry, ...s.entries] }));
  },

  removeEntry: async (id) => {
    const entry = await getEntry(id);
    await dbDeleteEntry(id);
    if (entry?.photoUri) {
      await FileSystem.deleteAsync(entry.photoUri, { idempotent: true }).catch(
        () => {}
      );
    }
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
  },

  updateSettings: (patch) => {
    const next = { ...get().settings, ...patch };
    set({ settings: next });
    persistSettings(next);
  },
}));
