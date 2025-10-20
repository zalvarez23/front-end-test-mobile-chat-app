import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import { Keyboard } from "react-native";
import { useAppContext } from "@/src/shared/hooks/AppContext";
import { useScrollToBottom } from "@/src/shared/hooks/useScrollToBottom";
import { Message } from "@/src/shared/types";
import { ImageMedia } from "@/src/shared/types/media";

export function useChatRoomScreen(chatId: string) {
  const {
    currentUser,
    users,
    chats,
    sendMessage,
    sendMessageWithMedia,
    editMessage,
    deleteMessage,
    markMessageAsRead,
    searchMessages,
  } = useAppContext();
  const { flatListRef, scrollToBottomWithDelay, scrollToBottomAnimated } =
    useScrollToBottom();
  const router = useRouter();

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const chat = chats.find((c) => c.id === chatId);

  const chatParticipants =
    chat?.participants
      .filter((id) => id !== currentUser?.id)
      .map((id) => users.find((user) => user.id === id))
      .filter(Boolean) || [];

  const chatName =
    chatParticipants.length === 1
      ? chatParticipants[0]?.name
      : `${chatParticipants[0]?.name || "Unknown"} & ${
          chatParticipants.length - 1
        } other${chatParticipants.length > 1 ? "s" : ""}`;

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (text.trim() && currentUser && chat) {
        try {
          await sendMessage(chat.id, text.trim(), currentUser.id);
          scrollToBottomWithDelay(150, false);
          scrollToBottomWithDelay(400, false);
        } catch (error) {}
      }
    },
    [sendMessage, currentUser, chat, scrollToBottomWithDelay]
  );

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleImageWithText = useCallback(
    async (image: ImageMedia, text: string = "") => {
      if (!currentUser || !chat) return;

      try {
        const success = await sendMessageWithMedia(
          chat.id,
          text.trim(),
          currentUser.id,
          {
            mediaType: "image",
            mediaUri: image.compressedUri || image.uri,
            thumbnailUri: image.thumbnailUri,
            metadata: {
              width: image.width,
              height: image.height,
              size: image.size,
              name: image.name,
            },
          }
        );

        if (success) {
          scrollToBottomWithDelay(100, true);
        }
      } catch (error) {}
    },
    [currentUser, chat, sendMessageWithMedia, scrollToBottomWithDelay]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (query.trim()) {
        searchTimeoutRef.current = setTimeout(async () => {
          try {
            const results = await searchMessages(query.trim(), chat?.id);
            setSearchResults(results);
          } catch (error) {
            setSearchResults([]);
          }
        }, 300) as unknown as NodeJS.Timeout;
      } else {
        setSearchResults([]);
      }
    },
    [searchMessages, chat?.id]
  );

  const handleClearSearch = useCallback(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setSearchResults([]);
    setSearchQuery("");
    setShowSearchBar(false);
  }, []);

  const toggleSearchBar = useCallback(() => {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar) {
      handleClearSearch();
    }
  }, [showSearchBar, handleClearSearch]);

  useEffect(() => {
    if (chat?.messages.length && flatListRef.current) {
      scrollToBottomWithDelay(100, false);
      scrollToBottomWithDelay(300, false);
    }
  }, [chat?.messages.length, chat?.id, scrollToBottomWithDelay]);

  useEffect(() => {
    if (chat && currentUser && chat.messages.length > 0) {
      const unreadMessages = chat.messages.filter(
        (message) =>
          message.senderId !== currentUser.id &&
          !message.readBy.includes(currentUser.id)
      );
      unreadMessages.forEach((message) => {
        markMessageAsRead(message.id, currentUser.id);
      });
    }
  }, [chat?.id, currentUser?.id, markMessageAsRead]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollToBottomWithDelay(100, true);
      }
    );

    return () => {
      keyboardDidShowListener?.remove();
    };
  }, [scrollToBottomWithDelay]);

  return {
    currentUser,
    chat,
    chatParticipants,
    chatName,
    flatListRef,
    handleSendMessage,
    handleImageWithText,
    handleBackPress,
    editMessage,
    deleteMessage,
    showSearchBar,
    searchResults,
    searchQuery,
    handleSearch,
    handleClearSearch,
    toggleSearchBar,
  };
}
