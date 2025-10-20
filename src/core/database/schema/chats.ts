import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const chats = sqliteTable("chats", {
  id: text("id").primaryKey(),
});

export const chatParticipants = sqliteTable("chat_participants", {
  id: text("id").primaryKey(),
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id),
  userId: text("user_id").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  chatId: text("chat_id")
    .notNull()
    .references(() => chats.id),
  senderId: text("sender_id").notNull(),
  text: text("text").notNull(),
  timestamp: integer("timestamp").notNull(),
  editedAt: integer("edited_at"),
  deletedAt: integer("deleted_at"),
  status: text("status").notNull().default("sent"),
  readBy: text("read_by"),
  hasMedia: integer("has_media", { mode: "boolean" }).default(false),
  mediaType: text("media_type"),
});

export const messageMedia = sqliteTable("message_media", {
  id: text("id").primaryKey(),
  messageId: text("message_id")
    .notNull()
    .references(() => messages.id),
  mediaType: text("media_type").notNull(),
  mediaUri: text("media_uri").notNull(),
  thumbnailUri: text("thumbnail_uri"),
  metadata: text("metadata"), // JSON with width, height, duration, size, etc.
  createdAt: integer("created_at").notNull(),
});
