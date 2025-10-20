import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface EditingIndicatorProps {
  onCancel: () => void;
}

export function EditingIndicator({ onCancel }: EditingIndicatorProps) {
  return (
    <ThemedView style={styles.container}>
      <MaterialIcons name="edit" size={20} color="#007AFF" />
      <ThemedText style={styles.text}>Editing message...</ThemedText>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <MaterialIcons name="close" size={20} color="#FF4444" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 122, 255, 0.2)",
  },
  text: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
  },
  cancelButton: {
    padding: 4,
  },
});
