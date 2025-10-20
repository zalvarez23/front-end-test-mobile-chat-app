import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { ChatEmptyProps } from "../types";

export function ChatEmpty({ onNewChatPress }: ChatEmptyProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.emptyText}>No chats yet</ThemedText>
      <ThemedText>Tap the + button to start a new conversation</ThemedText>
      <Pressable style={styles.createButton} onPress={onNewChatPress}>
        <IconSymbol name="plus" size={20} color="#007AFF" />
        <ThemedText style={styles.buttonText}>Create First Chat</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 8,
  },
});
