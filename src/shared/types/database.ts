import type { MessageMedia } from "./media";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
}

export interface ChatEntity {
  id: string;
}

export interface ParticipantEntity {
  id: string;
  chatId: string;
  userId: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  editedAt?: number;
  deletedAt?: number;
  status: "sent" | "delivered" | "read";
  readBy: string[];
  hasMedia?: boolean;
  mediaType?: "image" | "video" | "audio" | "document";
  media?: MessageMedia;
}

export interface MessageEntity
  extends Omit<
    Message,
    | "readBy"
    | "editedAt"
    | "deletedAt"
    | "status"
    | "hasMedia"
    | "mediaType"
    | "media"
  > {
  chatId: string;
  editedAt?: number | null;
  deletedAt?: number | null;
  status: string;
  readBy?: string | null;
  hasMedia?: boolean | null;
  mediaType?: string | null;
}

export interface MessageMediaEntity {
  id: string;
  messageId: string;
  mediaType: string;
  mediaUri: string;
  thumbnailUri?: string | null;
  metadata?: string | null;
  createdAt: number;
}

export interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
}
