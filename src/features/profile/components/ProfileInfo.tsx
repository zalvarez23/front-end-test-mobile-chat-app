import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { ProfileInfoProps } from "../types";

export function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Account Information</ThemedText>

      <ThemedView style={styles.infoRow}>
        <ThemedText style={styles.infoLabel}>ID:</ThemedText>
        <ThemedText>{user.id}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.infoRow}>
        <ThemedText style={styles.infoLabel}>Full Name:</ThemedText>
        <ThemedText>{user.name}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 10,
    width: 100,
  },
});
