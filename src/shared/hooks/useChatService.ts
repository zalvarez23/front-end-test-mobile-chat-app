import { useState, useEffect, useCallback, useMemo } from "react";
import { ChatService } from "@/src/shared/services/ChatService";
import { Chat, Message, UseChatServiceReturn } from "@/src/shared/types";

export function useChatService(
  currentUserId: string | null
): UseChatServiceReturn {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const chatService = useMemo(() => new ChatService(), []);

  useEffect(() => {
    const loadChats = async () => {
      if (!currentUserId) {
        setChats([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userChats = await chatService.getChatsForUser(currentUserId);
        setChats(userChats);
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, [currentUserId, chatService]);

  const createChat = useCallback(
    async (participantIds: string[]) => {
      if (!currentUserId || !participantIds.includes(currentUserId)) {
        return null;
      }

      try {
        const newChat = await chatService.createChat(participantIds);

        if (newChat) {
          setChats((prevChats) => [...prevChats, newChat]);
        }

        return newChat;
      } catch (error) {
        console.error("Error creating chat:", error);
        return null;
      }
    },
    [currentUserId, chatService]
  );

  const sendMessage = useCallback(
    async (chatId: string, text: string, senderId: string) => {
      if (!text.trim()) return false;

      try {
        const newMessage = await chatService.sendMessage(
          chatId,
          text,
          senderId
        );

        if (newMessage) {
          setChats((prevChats) => {
            return prevChats.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  lastMessage: newMessage,
                };
              }
              return chat;
            });
          });
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    [chatService]
  );

  const sendMessageWithMedia = useCallback(
    async (
      chatId: string,
      text: string,
      senderId: string,
      mediaData: {
        mediaType: string;
        mediaUri: string;
        thumbnailUri?: string;
        metadata?: any;
      }
    ) => {
      try {
        const newMessage = await chatService.sendMessageWithMedia(
          chatId,
          text,
          senderId,
          mediaData
        );

        if (newMessage) {
          setChats((prevChats) => {
            return prevChats.map((chat) => {
              if (chat.id === chatId) {
                return {
                  ...chat,
                  messages: [...chat.messages, newMessage],
                  lastMessage: newMessage,
                };
              }
              return chat;
            });
          });
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
    [chatService]
  );

  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      if (!newText.trim()) return false;

      try {
        const success = await chatService.editMessage(messageId, newText);

        if (success) {
          const editedAt = Date.now();
          setChats((prevChats) => {
            return prevChats.map((chat) => ({
              ...chat,
              messages: chat.messages.map((message) =>
                message.id === messageId
                  ? { ...message, text: newText.trim(), editedAt }
                  : message
              ),
            }));
          });
        }

        return success;
      } catch (error) {
        return false;
      }
    },
    [chatService]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      try {
        const success = await chatService.deleteMessage(messageId);

        if (success) {
          setChats((prevChats) => {
            return prevChats.map((chat) => ({
              ...chat,
              messages: chat.messages.filter(
                (message) => message.id !== messageId
              ),
              lastMessage:
                chat.lastMessage?.id === messageId
                  ? chat.messages[chat.messages.length - 2]
                  : chat.lastMessage,
            }));
          });
        }

        return success;
      } catch (error) {
        return false;
      }
    },
    [chatService]
  );

  const markMessageAsRead = useCallback(
    async (messageId: string, userId: string) => {
      try {
        const success = await chatService.markMessageAsRead(messageId, userId);

        if (success) {
          setChats((prevChats) => {
            return prevChats.map((chat) => ({
              ...chat,
              messages: chat.messages.map((message) => {
                if (
                  message.id === messageId &&
                  !message.readBy.includes(userId)
                ) {
                  return {
                    ...message,
                    readBy: [...message.readBy, userId],
                    status: "read" as const,
                  };
                }
                return message;
              }),
            }));
          });
        }

        return success;
      } catch (error) {
        return false;
      }
    },
    [chatService]
  );

  const searchMessages = useCallback(
    async (query: string, chatId?: string) => {
      try {
        return await chatService.searchMessages(query, chatId);
      } catch (error) {
        return [];
      }
    },
    [chatService]
  );

  return useMemo(
    () => ({
      chats,
      createChat,
      sendMessage,
      sendMessageWithMedia,
      editMessage,
      deleteMessage,
      markMessageAsRead,
      searchMessages,
      loading,
    }),
    [
      chats,
      createChat,
      sendMessage,
      sendMessageWithMedia,
      editMessage,
      deleteMessage,
      markMessageAsRead,
      searchMessages,
      loading,
    ]
  );
}
