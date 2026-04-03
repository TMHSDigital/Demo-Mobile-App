export interface JournalEntry {
  id: string;
  photoUri: string;
  caption: string;
  aiDescription?: string;
  createdAt: string;
}

export interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string;
}
