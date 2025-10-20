import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";
import * as schema from "./schema";

export class DatabaseManager {
  private static instance: DatabaseManager;
  private db: any;
  private sqlite: any;

  private constructor() {
    this.sqlite = SQLite.openDatabaseSync("chat-app-v4.db");
    this.db = drizzle(this.sqlite, { schema });
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  getDatabase() {
    return this.db;
  }

  getSqlite() {
    return this.sqlite;
  }

  async initializeDatabase(): Promise<void> {
    try {
      console.log("Creating users table...");
      await this.sqlite.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          avatar TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'offline'
        );
      `);

      console.log("Creating chats table...");
      await this.sqlite.execAsync(`
        CREATE TABLE IF NOT EXISTS chats (
          id TEXT PRIMARY KEY
        );
      `);

      console.log("Creating chat_participants table...");
      await this.sqlite.execAsync(`
        CREATE TABLE IF NOT EXISTS chat_participants (
          id TEXT PRIMARY KEY,
          chat_id TEXT NOT NULL,
          user_id TEXT NOT NULL,
          FOREIGN KEY (chat_id) REFERENCES chats (id)
        );
      `);

      console.log("Creating messages table...");
      await this.sqlite.execAsync(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          chat_id TEXT NOT NULL,
          sender_id TEXT NOT NULL,
          text TEXT NOT NULL,
          timestamp INTEGER NOT NULL,
          edited_at INTEGER,
          deleted_at INTEGER,
          status TEXT NOT NULL DEFAULT 'sent',
          read_by TEXT,
          has_media INTEGER DEFAULT 0,
          media_type TEXT,
          FOREIGN KEY (chat_id) REFERENCES chats (id)
        );
      `);

      try {
        await this.sqlite.execAsync(`
          ALTER TABLE messages ADD COLUMN has_media INTEGER DEFAULT 0;
        `);
      } catch (error) {
        console.log("has_media column might already exist");
      }

      try {
        await this.sqlite.execAsync(`
          ALTER TABLE messages ADD COLUMN media_type TEXT;
        `);
      } catch (error) {
        console.log("media_type column might already exist");
      }

      console.log("Creating message_media table...");
      await this.sqlite.execAsync(`
        CREATE TABLE IF NOT EXISTS message_media (
          id TEXT PRIMARY KEY,
          message_id TEXT NOT NULL,
          media_type TEXT NOT NULL,
          media_uri TEXT NOT NULL,
          thumbnail_uri TEXT,
          metadata TEXT,
          created_at INTEGER NOT NULL,
          FOREIGN KEY (message_id) REFERENCES messages (id)
        );
      `);

      console.log("All tables created successfully!");
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  }
}
