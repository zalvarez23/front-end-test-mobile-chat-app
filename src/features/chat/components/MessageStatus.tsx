import React from "react";
import { View, StyleSheet } from "react-native";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { useColorScheme } from "@/src/shared/hooks/useColorScheme";

interface MessageStatusProps {
  status: "sent" | "delivered" | "read";
  readBy?: string[];
  totalParticipants?: number;
}

export function MessageStatus({
  status,
  readBy = [],
  totalParticipants = 0,
}: MessageStatusProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const getStatusIcon = () => {
    switch (status) {
      case "sent":
        return "checkmark";
      case "delivered":
        return "checkmark.circle";
      case "read":
        return "checkmark.circle.fill";
      default:
        return "checkmark";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "sent":
        return isDark ? "#9BA1A6" : "#687076";
      case "delivered":
        return isDark ? "#9BA1A6" : "#687076";
      case "read":
        return "#007AFF";
      default:
        return isDark ? "#9BA1A6" : "#687076";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "sent":
        return "Sent";
      case "delivered":
        return "Delivered";
      case "read":
        return `Read by ${readBy.length}/${totalParticipants - 1}`;
      default:
        return "Sent";
    }
  };

  return (
    <View style={styles.container}>
      <IconSymbol name={getStatusIcon()} size={12} color={getStatusColor()} />
      {status === "read" && totalParticipants > 2 && (
        <View style={styles.readCount}>
          <IconSymbol name="person.fill" size={8} color={getStatusColor()} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  readCount: {
    marginLeft: 2,
  },
});
