import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { AuthLoadingProps } from "../types";

export function AuthLoading({ message = "Loading..." }: AuthLoadingProps) {
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
