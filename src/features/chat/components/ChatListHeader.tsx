import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { ChatListHeaderProps } from "../types";

export function ChatListHeader({ onNewChatPress }: ChatListHeaderProps) {
  return (
    <ThemedView style={styles.header}>
      <ThemedText type="title">Chats</ThemedText>
      <Pressable style={styles.newChatButton} onPress={onNewChatPress}>
        <IconSymbol name="plus" size={24} color="#007AFF" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  newChatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
});
