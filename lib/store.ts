import { create } from "zustand";
import { JournalEntry, AppSettings } from "./types";
import {
  getAllEntries,
  insertEntry,
  deleteEntry as dbDeleteEntry,
} from "./database";

interface StoreState {
  entries: JournalEntry[];
  settings: AppSettings;
  loadEntries: () => Promise<void>;
  addEntry: (entry: JournalEntry) => Promise<void>;
  removeEntry: (id: string) => Promise<void>;
  updateSettings: (patch: Partial<AppSettings>) => void;
}

export const useStore = create<StoreState>((set) => ({
  entries: [],
  settings: {
    reminderEnabled: false,
    reminderTime: "20:00",
  },

  loadEntries: async () => {
    const entries = await getAllEntries();
    set({ entries });
  },

  addEntry: async (entry) => {
    await insertEntry(entry);
    set((s) => ({ entries: [entry, ...s.entries] }));
  },

  removeEntry: async (id) => {
    await dbDeleteEntry(id);
    set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
  },

  updateSettings: (patch) => {
    set((s) => ({ settings: { ...s.settings, ...patch } }));
  },
}));
