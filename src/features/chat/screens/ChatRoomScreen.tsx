import React from "react";
import {
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { SearchBar } from "@/src/shared/components/SearchBar";
import { ChatHeader } from "../components/ChatHeader";
import { MessageBubble } from "../components/MessageBubble";
import { MessageInput } from "../components/MessageInput";
import { EditMessageInput } from "../components/EditMessageInput";
import { EditingIndicator } from "../components/EditingIndicator";
import { useChatRoomScreen } from "../hooks/useChatRoomScreen";
import { useMessageEditing } from "../hooks/useMessageEditing";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Message } from "@/src/shared/types";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const {
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
  } = useChatRoomScreen(chatId || "");

  const {
    editMessageVisible,
    editingMessage,
    handleEditMessage,
    handleSaveEdit,
    handleCancelEdit,
  } = useMessageEditing(editMessage);

  if (!chat || !currentUser) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText>Chat not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar style="auto" />
      <Stack.Screen
        options={{
          headerTitle: () => (
            <ChatHeader
              chatName={chatName || "Unknown"}
              participants={chatParticipants.filter(Boolean)}
              onBackPress={handleBackPress}
            />
          ),
          headerLeft: () => null,
          headerBackVisible: false,
          headerRight: () => (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={toggleSearchBar}
            >
              <MaterialIcons
                name={showSearchBar ? "close" : "search"}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>
          ),
        }}
      />

      {showSearchBar && (
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClearSearch}
          placeholder="Search messages..."
          autoFocus={true}
        />
      )}

      {editMessageVisible && editingMessage && (
        <EditingIndicator onCancel={handleCancelEdit} />
      )}

      <FlatList
        ref={flatListRef}
        data={
          editMessageVisible && editingMessage
            ? ([
                chat.messages.find((msg) => msg.id === editingMessage.id),
              ].filter(Boolean) as Message[])
            : showSearchBar && searchResults.length > 0
            ? searchResults
            : chat.messages
        }
        keyExtractor={React.useCallback((item: Message) => item.id, [])}
        renderItem={React.useCallback(
          ({ item }: { item: Message }) => (
            <MessageBubble
              message={item}
              isCurrentUser={item.senderId === currentUser.id}
              onEditMessage={handleEditMessage}
              onDeleteMessage={deleteMessage}
              totalParticipants={chat.participants.length}
              isEditing={editingMessage?.id === item.id}
            />
          ),
          [
            currentUser,
            handleEditMessage,
            deleteMessage,
            chat.participants.length,
            editingMessage?.id,
          ]
        )}
        contentContainerStyle={[
          styles.messagesContainer,
          { flexGrow: 1, justifyContent: "flex-end" },
        ]}
        initialNumToRender={20}
        maxToRenderPerBatch={15}
        windowSize={10}
        removeClippedSubviews={false}
        disableVirtualization={false}
        onContentSizeChange={() => {}}
        ListEmptyComponent={() => (
          <ThemedView style={styles.emptyContainer}>
            <ThemedText>
              {editMessageVisible
                ? "Editing message..."
                : showSearchBar && searchQuery
                ? `No messages found for "${searchQuery}"`
                : "No messages yet. Say hello!"}
            </ThemedText>
          </ThemedView>
        )}
      />

      <SafeAreaView edges={["bottom"]} style={styles.inputContainer}>
        {editMessageVisible ? (
          <EditMessageInput
            currentText={editingMessage?.text || ""}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
          />
        ) : (
          <MessageInput
            onSendMessage={handleSendMessage}
            onImageWithText={handleImageWithText}
          />
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    padding: 10,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  searchButton: {
    padding: 8,
    marginRight: 8,
  },
  inputContainer: {
    backgroundColor: "transparent",
  },
});
