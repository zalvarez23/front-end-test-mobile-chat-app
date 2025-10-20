import { createContext, useContext, ReactNode, useMemo } from "react";
import { useDatabase } from "./useDatabase";
import { DatabaseProvider } from "@/src/core/database/DatabaseProvider";
import { useChatService } from "./useChatService";
import { useUserService } from "./useUserService";
import { useAuthService } from "./useAuthService";
import { AppContextType, Chat } from "@/src/shared/types";

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppContent({ children }: { children: ReactNode }) {
  const { isInitialized } = useDatabase();
  const authService = useAuthService();
  const userService = useUserService();
  const chatService = useChatService(authService.currentUser?.id || null);

  const loading =
    !isInitialized ||
    authService.loading ||
    userService.loading ||
    chatService.loading;

  const value = useMemo(
    () => ({
      currentUser: authService.currentUser,
      isLoggedIn: authService.isLoggedIn,
      login: authService.login,
      logout: authService.logout,

      users: userService.users,
      createUser: userService.createUser,
      updateUser: userService.updateUser,
      deleteUser: userService.deleteUser,

      chats: chatService.chats,
      createChat: chatService.createChat,
      sendMessage: chatService.sendMessage,
      sendMessageWithMedia: chatService.sendMessageWithMedia,
      editMessage: chatService.editMessage,
      deleteMessage: chatService.deleteMessage,
      markMessageAsRead: chatService.markMessageAsRead,
      searchMessages: chatService.searchMessages,

      loading,
      dbInitialized: isInitialized,
    }),
    [
      authService.currentUser,
      authService.isLoggedIn,
      authService.login,
      authService.logout,
      userService.users,
      userService.createUser,
      userService.updateUser,
      userService.deleteUser,
      chatService.chats,
      chatService.createChat,
      chatService.sendMessage,
      chatService.sendMessageWithMedia,
      chatService.editMessage,
      chatService.deleteMessage,
      chatService.markMessageAsRead,
      chatService.searchMessages,
      chatService.loading,
      loading,
      isInitialized,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <DatabaseProvider>
      <AppContent>{children}</AppContent>
    </DatabaseProvider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export { Chat } from "@/src/shared/types";
