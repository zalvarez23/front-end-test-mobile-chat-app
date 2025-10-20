import { DatabaseManager } from "./DatabaseManager";

const databaseManager = DatabaseManager.getInstance();

export const db = databaseManager.getDatabase();
export const sqlite = databaseManager.getSqlite();

export async function initializeDatabase() {
  return databaseManager.initializeDatabase();
}
