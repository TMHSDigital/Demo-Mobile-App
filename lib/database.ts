import * as SQLite from "expo-sqlite";
import { JournalEntry } from "./types";

let db: SQLite.SQLiteDatabase;

export async function initDatabase(): Promise<void> {
  db = await SQLite.openDatabaseAsync("snaplog.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY NOT NULL,
      photoUri TEXT NOT NULL,
      caption TEXT NOT NULL DEFAULT '',
      aiDescription TEXT,
      createdAt TEXT NOT NULL
    );
  `);
}

export async function insertEntry(entry: JournalEntry): Promise<void> {
  await db.runAsync(
    "INSERT INTO entries (id, photoUri, caption, aiDescription, createdAt) VALUES (?, ?, ?, ?, ?)",
    entry.id,
    entry.photoUri,
    entry.caption,
    entry.aiDescription ?? null,
    entry.createdAt
  );
}

export async function getAllEntries(): Promise<JournalEntry[]> {
  return db.getAllAsync<JournalEntry>(
    "SELECT * FROM entries ORDER BY createdAt DESC"
  );
}

export async function getEntry(id: string): Promise<JournalEntry | null> {
  const row = await db.getFirstAsync<JournalEntry>(
    "SELECT * FROM entries WHERE id = ?",
    id
  );
  return row ?? null;
}

export async function deleteEntry(id: string): Promise<void> {
  await db.runAsync("DELETE FROM entries WHERE id = ?", id);
}

export async function updateEntry(
  id: string,
  fields: Partial<Pick<JournalEntry, "caption" | "aiDescription">>
): Promise<void> {
  const sets: string[] = [];
  const values: (string | null)[] = [];

  if (fields.caption !== undefined) {
    sets.push("caption = ?");
    values.push(fields.caption);
  }
  if (fields.aiDescription !== undefined) {
    sets.push("aiDescription = ?");
    values.push(fields.aiDescription);
  }

  if (sets.length === 0) return;

  values.push(id);
  await db.runAsync(
    `UPDATE entries SET ${sets.join(", ")} WHERE id = ?`,
    ...values
  );
}
