import {
  ChatEntity,
  MessageEntity,
  ParticipantEntity,
  MessageMediaEntity,
} from "@/src/shared/types";

export interface IChatRepository {
  createChat(chatId: string): Promise<void>;
  getChatById(chatId: string): Promise<ChatEntity | null>;
  getChatsByUserId(userId: string): Promise<string[]>;

  addParticipant(chatId: string, userId: string): Promise<void>;
  getChatParticipants(chatId: string): Promise<string[]>;

  createMessage(messageData: {
    id: string;
    chatId: string;
    senderId: string;
    text: string;
    timestamp: number;
    status: string;
    readBy: string;
    hasMedia?: boolean;
    mediaType?: string;
  }): Promise<void>;
  getMessagesByChatId(chatId: string): Promise<MessageEntity[]>;
  updateMessage(
    messageId: string,
    updates: Partial<MessageEntity>
  ): Promise<void>;
  getMessageById(messageId: string): Promise<MessageEntity | null>;
  searchMessages(query: string, chatId?: string): Promise<MessageEntity[]>;

  createMessageMedia(mediaData: {
    id: string;
    messageId: string;
    mediaType: string;
    mediaUri: string;
    thumbnailUri?: string;
    metadata?: string;
    createdAt: number;
  }): Promise<void>;
  getMessageMedia(messageId: string): Promise<MessageMediaEntity | null>;
  getMessagesWithMedia(
    chatId: string
  ): Promise<(MessageEntity & { media?: MessageMediaEntity })[]>;
}
