import React from "react";
import { StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { LogoutButtonProps } from "../types";

export function LogoutButton({ onPress }: LogoutButtonProps) {
  return (
    <ThemedView style={styles.container}>
      <Pressable style={styles.button} onPress={onPress}>
        <IconSymbol name="arrow.right.square" size={20} color="#FFFFFF" />
        <ThemedText style={styles.buttonText}>Log Out</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 80,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
});
