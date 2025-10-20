import { User, Chat, Message } from "./database";

export interface UseAuthServiceReturn {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (userId: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface UseUserServiceReturn {
  users: User[];
  createUser: (userData: Omit<User, "id">) => Promise<User | null>;
  updateUser: (userId: string, updates: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  loading: boolean;
}

export interface UseUserDbReturn extends UseUserServiceReturn {}

export interface UseChatServiceReturn {
  chats: Chat[];
  createChat: (participantIds: string[]) => Promise<Chat | null>;
  sendMessage: (
    chatId: string,
    text: string,
    senderId: string
  ) => Promise<boolean>;
  sendMessageWithMedia: (
    chatId: string,
    text: string,
    senderId: string,
    mediaData: {
      mediaType: string;
      mediaUri: string;
      thumbnailUri?: string;
      metadata?: any;
    }
  ) => Promise<boolean>;
  editMessage: (messageId: string, newText: string) => Promise<boolean>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  markMessageAsRead: (messageId: string, userId: string) => Promise<boolean>;
  searchMessages: (query: string, chatId?: string) => Promise<Message[]>;
  loading: boolean;
}

export type UseUserReturn = UseUserDbReturn;
export type UseChatsReturn = UseChatServiceReturn;
