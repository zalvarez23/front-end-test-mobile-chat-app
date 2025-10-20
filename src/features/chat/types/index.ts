import { User, Chat, Message } from "@/src/shared/types";
import { ImageMedia } from "@/src/shared/types/media";

export interface ChatListScreenProps {
  initialTab?: string;
}

export interface ChatRoomScreenProps {
  chatId: string;
}

export interface ChatHeaderProps {
  chatName: string;
  participants: (User | undefined)[];
  onBackPress: () => void;
}

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onImageWithText: (image: ImageMedia, text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export interface ChatListHeaderProps {
  onNewChatPress: () => void;
}

export interface NewChatModalProps {
  visible: boolean;
  onClose: () => void;
  onCreateChat: (participantIds: string[]) => void;
}

export interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
  users: User[];
}

export interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onEditMessage?: (messageId: string, currentText: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  totalParticipants?: number;
  isEditing?: boolean;
}

export interface ChatEmptyProps {
  onNewChatPress: () => void;
}
