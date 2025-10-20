import { IChatRepository } from "@/src/shared/repositories/interfaces/IChatRepository";
import { MessageEntity } from "@/src/shared/types";
import { SqliteChatRepository } from "@/src/shared/repositories/SqliteChatRepository";
import { Chat, Message } from "@/src/shared/types";

export class ChatService {
  private repository: IChatRepository;

  constructor(repository?: IChatRepository) {
    this.repository = repository || new SqliteChatRepository();
  }

  async createChat(participantIds: string[]): Promise<Chat | null> {
    if (participantIds.length < 2) {
      throw new Error("A chat must have at least 2 participants");
    }

    const chatId = `chat${Date.now()}`;

    try {
      await this.repository.createChat(chatId);

      for (const userId of participantIds) {
        await this.repository.addParticipant(chatId, userId);
      }

      return {
        id: chatId,
        participants: participantIds,
        messages: [],
      };
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  }

  async getChatsForUser(userId: string): Promise<Chat[]> {
    try {
      const chatIds = await this.repository.getChatsByUserId(userId);

      if (chatIds.length === 0) {
        return [];
      }

      const chats: Chat[] = [];

      for (const chatId of chatIds) {
        const chat = await this.getChatById(chatId);
        if (chat) {
          chats.push(chat);
        }
      }

      return chats;
    } catch (error) {
      console.error("Error getting chats for user:", error);
      return [];
    }
  }

  async getChatById(chatId: string): Promise<Chat | null> {
    try {
      const participantIds = await this.repository.getChatParticipants(chatId);

      if (participantIds.length === 0) {
        return null;
      }

      const messagesData = await this.repository.getMessagesWithMedia(chatId);

      const messages = messagesData
        .filter((m) => !m.deletedAt)
        .map((m) => ({
          id: m.id,
          senderId: m.senderId,
          text: m.text,
          timestamp: m.timestamp,
          editedAt: m.editedAt || undefined,
          deletedAt: m.deletedAt || undefined,
          status: (m.status as "sent" | "delivered" | "read") || "delivered",
          readBy: m.readBy ? JSON.parse(m.readBy) : [],
          hasMedia: m.hasMedia || false,
          mediaType: m.mediaType as
            | "image"
            | "video"
            | "audio"
            | "document"
            | undefined,
          media: m.media
            ? {
                id: m.media.id,
                messageId: m.media.messageId,
                mediaType: m.media.mediaType as
                  | "image"
                  | "video"
                  | "audio"
                  | "document",
                mediaUri: m.media.mediaUri,
                thumbnailUri: m.media.thumbnailUri || undefined,
                metadata: m.media.metadata
                  ? JSON.parse(m.media.metadata)
                  : undefined,
              }
            : undefined,
        }));

      const lastMessage =
        messages.length > 0 ? messages[messages.length - 1] : undefined;

      return {
        id: chatId,
        participants: participantIds,
        messages,
        lastMessage,
      };
    } catch (error) {
      console.error("Error getting chat by id:", error);
      return null;
    }
  }

  async sendMessage(
    chatId: string,
    text: string,
    senderId: string
  ): Promise<Message | null> {
    if (!text.trim()) {
      return null;
    }

    try {
      const messageId = `msg${Date.now()}`;
      const timestamp = Date.now();

      const messageData = {
        id: messageId,
        chatId,
        senderId,
        text: text.trim(),
        timestamp,
        status: "delivered",
        readBy: JSON.stringify([]),
        hasMedia: false,
      };

      await this.repository.createMessage(messageData);

      return {
        id: messageId,
        senderId,
        text: text.trim(),
        timestamp,
        status: "delivered",
        readBy: [],
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return null;
    }
  }

  async sendMessageWithMedia(
    chatId: string,
    text: string,
    senderId: string,
    mediaData: {
      mediaType: string;
      mediaUri: string;
      thumbnailUri?: string;
      metadata?: any;
    }
  ): Promise<Message | null> {
    try {
      const messageId = `msg${Date.now()}`;
      const timestamp = Date.now();

      const messageData = {
        id: messageId,
        chatId,
        senderId,
        text: text.trim(),
        timestamp,
        status: "delivered",
        readBy: JSON.stringify([]),
        hasMedia: true,
        mediaType: mediaData.mediaType,
      };

      await this.repository.createMessage(messageData);

      const mediaId = `media${Date.now()}`;
      await this.repository.createMessageMedia({
        id: mediaId,
        messageId,
        mediaType: mediaData.mediaType,
        mediaUri: mediaData.mediaUri,
        thumbnailUri: mediaData.thumbnailUri,
        metadata: JSON.stringify(mediaData.metadata || {}),
        createdAt: timestamp,
      });

      return {
        id: messageId,
        senderId,
        text: text.trim(),
        timestamp,
        status: "delivered",
        readBy: [],
        hasMedia: true,
        mediaType: mediaData.mediaType as any,
        media: {
          id: mediaId,
          messageId,
          mediaType: mediaData.mediaType as any,
          mediaUri: mediaData.mediaUri,
          thumbnailUri: mediaData.thumbnailUri,
          metadata: mediaData.metadata,
        },
      };
    } catch (error) {
      console.error("Error sending message with media:", error);
      return null;
    }
  }

  async editMessage(messageId: string, newText: string): Promise<boolean> {
    if (!newText.trim()) {
      return false;
    }

    try {
      const editedAt = Date.now();

      await this.repository.updateMessage(messageId, {
        text: newText.trim(),
        editedAt,
      });

      return true;
    } catch (error) {
      console.error("Error editing message:", error);
      return false;
    }
  }

  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const deletedAt = Date.now();

      await this.repository.updateMessage(messageId, {
        deletedAt,
      });

      return true;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  }

  async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    try {
      const message = await this.repository.getMessageById(messageId);

      if (!message) {
        return false;
      }

      const currentReadBy = message.readBy ? JSON.parse(message.readBy) : [];

      if (!currentReadBy.includes(userId)) {
        currentReadBy.push(userId);
      }

      await this.repository.updateMessage(messageId, {
        readBy: JSON.stringify(currentReadBy),
        status: "read",
      });

      return true;
    } catch (error) {
      console.error("Error marking message as read:", error);
      return false;
    }
  }

  async searchMessages(query: string, chatId?: string): Promise<Message[]> {
    try {
      const results = await this.repository.searchMessages(query, chatId);

      return results.map((m: MessageEntity) => ({
        id: m.id,
        senderId: m.senderId,
        text: m.text,
        timestamp: m.timestamp,
        editedAt: m.editedAt || undefined,
        deletedAt: m.deletedAt || undefined,
        status: (m.status as "sent" | "delivered" | "read") || "sent",
        readBy: m.readBy ? JSON.parse(m.readBy) : [],
      }));
    } catch (error) {
      console.error("Error searching messages:", error);
      return [];
    }
  }
}
