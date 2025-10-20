import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { Avatar } from "@/src/shared/components/Avatar";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { ChatHeaderProps } from "../types";

export function ChatHeader({
  chatName,
  participants,
  onBackPress,
}: ChatHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <Pressable onPress={onBackPress} style={styles.backButton}>
        <IconSymbol name="chevron.left" size={24} color="#007AFF" />
      </Pressable>
      <Avatar user={participants[0]} size={32} showStatus={false} />
      <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.title}>
        {chatName}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    flex: 1,
    marginLeft: 8,
  },
});
