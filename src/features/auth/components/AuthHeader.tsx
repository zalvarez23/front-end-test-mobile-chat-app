import React from "react";
import { StyleSheet } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { AuthHeaderProps } from "../types";

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{title}</ThemedText>
      {subtitle && <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#8F8F8F",
  },
});
