import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { Avatar } from "@/src/shared/components/Avatar";
import { ProfileHeaderProps } from "../types";

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <Avatar user={user} size={100} />
      <ThemedView style={styles.profileInfo}>
        <ThemedText type="title">{user.name}</ThemedText>
        <ThemedText style={styles.statusText}>
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 30,
    paddingTop: 40,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 16,
  },
  statusText: {
    fontSize: 16,
    color: "#8F8F8F",
    marginTop: 4,
  },
});
