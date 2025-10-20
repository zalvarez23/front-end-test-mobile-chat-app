import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { ChatListHeader } from "../components/ChatListHeader";
import { ChatListItem } from "../components/ChatListItem";
import { ChatEmpty } from "../components/ChatEmpty";
import { NewChatModal } from "../components/NewChatModal";
import { useChatListScreen } from "../hooks/useChatListScreen";

export default function ChatListScreen() {
  const {
    currentUser,
    users,
    chats,
    modalVisible,
    selectedUsers,
    availableUsers,
    toggleUserSelection,
    handleCreateChat,
    openNewChatModal,
    closeNewChatModal,
  } = useChatListScreen();

  const renderEmptyComponent = () => (
    <ChatEmpty onNewChatPress={openNewChatModal} />
  );

  return (
    <ThemedView style={styles.container}>
      <ChatListHeader onNewChatPress={openNewChatModal} />

      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatListItem
            chat={item}
            currentUserId={currentUser?.id || ""}
            users={users}
          />
        )}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContainer}
      />

      <NewChatModal
        visible={modalVisible}
        onClose={closeNewChatModal}
        onCreateChat={handleCreateChat}
        users={availableUsers}
        selectedUsers={selectedUsers}
        onToggleUser={toggleUserSelection}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  listContainer: {
    flexGrow: 1,
  },
});
