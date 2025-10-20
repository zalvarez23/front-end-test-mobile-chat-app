import React from "react";
import { StyleSheet, Modal, FlatList, Pressable } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { UserListItem } from "@/src/shared/components/UserListItem";
import { NewChatModalProps } from "../types";
import { User } from "@/src/shared/types";

export function NewChatModal({
  visible,
  onClose,
  onCreateChat,
  users,
  selectedUsers,
  onToggleUser,
}: NewChatModalProps & {
  users: User[];
  selectedUsers: string[];
  onToggleUser: (userId: string) => void;
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ThemedView style={styles.modalContainer}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.modalHeader}>
            <ThemedText type="subtitle">New Chat</ThemedText>
            <Pressable onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="#007AFF" />
            </Pressable>
          </ThemedView>

          <ThemedText style={styles.modalSubtitle}>
            Select users to chat with
          </ThemedText>

          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UserListItem
                user={item}
                onSelect={() => onToggleUser(item.id)}
                isSelected={selectedUsers.includes(item.id)}
              />
            )}
            style={styles.userList}
          />

          <Pressable
            style={[
              styles.createButton,
              selectedUsers.length === 0 && styles.disabledButton,
            ]}
            disabled={selectedUsers.length === 0}
            onPress={() => onCreateChat(selectedUsers)}
          >
            <ThemedText style={styles.createButtonText}>Create Chat</ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalSubtitle: {
    marginBottom: 10,
  },
  userList: {
    maxHeight: 400,
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: "#CCCCCC",
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
