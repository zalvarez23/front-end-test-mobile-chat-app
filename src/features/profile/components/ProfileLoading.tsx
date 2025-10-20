import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { ProfileLoadingProps } from "../types";

export function ProfileLoading({
  message = "Loading user profile...",
}: ProfileLoadingProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>{message}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
