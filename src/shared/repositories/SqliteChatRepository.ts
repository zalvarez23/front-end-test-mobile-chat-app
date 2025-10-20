import { db } from "@/src/core/database/db";
import {
  chats,
  chatParticipants,
  messages,
  messageMedia,
} from "@/src/core/database/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { IChatRepository } from "./interfaces/IChatRepository";
import {
  ChatEntity,
  MessageEntity,
  MessageMediaEntity,
} from "@/src/shared/types";

export class SqliteChatRepository implements IChatRepository {
  async createChat(chatId: string): Promise<void> {
    try {
      await db.insert(chats).values({ id: chatId });
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  }

  async getChatById(chatId: string): Promise<ChatEntity | null> {
    const result = await db.select().from(chats).where(eq(chats.id, chatId));
    return result[0] || null;
  }

  async getChatsByUserId(userId: string): Promise<string[]> {
    const participantRows = await db
      .select()
      .from(chatParticipants)
      .where(eq(chatParticipants.userId, userId));

    return participantRows.map((row) => row.chatId);
  }

  async addParticipant(chatId: string, userId: string): Promise<void> {
    try {
      await db.insert(chatParticipants).values({
        id: `cp-${chatId}-${userId}`,
        chatId,
        userId,
      });
    } catch (error) {
      console.error("Error adding participant:", error);
      throw error;
    }
  }

  async getChatParticipants(chatId: string): Promise<string[]> {
    const participants = await db
      .select()
      .from(chatParticipants)
      .where(eq(chatParticipants.chatId, chatId));

    return participants.map((p) => p.userId);
  }

  async createMessage(messageData: {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    timestamp: number;
    status: string;
    readBy: string;
    hasMedia?: boolean;
    mediaType?: string;
  }): Promise<void> {
    try {
      await db.insert(messages).values(messageData);
    } catch (error) {
      console.error("Error creating message:", error);
      throw error;
    }
  }

  async getMessagesByChatId(chatId: string): Promise<MessageEntity[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.timestamp);
  }

  async updateMessage(
    messageId: string,
    updates: Partial<MessageEntity>
  ): Promise<void> {
    try {
      await db.update(messages).set(updates).where(eq(messages.id, messageId));
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  }

  async getMessageById(messageId: string): Promise<MessageEntity | null> {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.id, messageId));
    return result[0] || null;
  }

  async searchMessages(
    query: string,
    chatId?: string
  ): Promise<MessageEntity[]> {
    const conditions = [
      sql`${messages.text} LIKE ${`%${query}%`}`,
      sql`${messages.deletedAt} IS NULL`,
    ];

    if (chatId) {
      conditions.push(eq(messages.chatId, chatId));
    }

    return await db
      .select()
      .from(messages)
      .where(and(...conditions));
  }

  async createMessageMedia(mediaData: {
    id: string;
    messageId: string;
    mediaType: string;
    mediaUri: string;
    thumbnailUri?: string;
    metadata?: string;
    createdAt: number;
  }): Promise<void> {
    try {
      await db.insert(messageMedia).values(mediaData);
    } catch (error) {
      throw error;
    }
  }

  async getMessageMedia(messageId: string): Promise<MessageMediaEntity | null> {
    const result = await db
      .select()
      .from(messageMedia)
      .where(eq(messageMedia.messageId, messageId))
      .limit(1);

    return result[0] || null;
  }

  async getMessagesWithMedia(
    chatId: string
  ): Promise<(MessageEntity & { media?: MessageMediaEntity })[]> {
    const messagesResult = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.timestamp);

    const messagesWithMedia = await Promise.all(
      messagesResult.map(async (message) => {
        if (message.hasMedia) {
          const media = await this.getMessageMedia(message.id);
          return { ...message, media: media || undefined };
        }
        return { ...message, media: undefined };
      })
    );

    return messagesWithMedia;
  }
}
