import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { User } from "@/src/shared/types";

interface AvatarProps {
  user?: User;
  size?: number;
  showStatus?: boolean;
}

const getAvatarColor = (identifier?: string): string => {
  if (!identifier) return "#C0C0C0";

  let hash = 0;
  for (let i = 0; i < identifier.length; i++) {
    hash = identifier.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }

  return color;
};

const getInitials = (name?: string): string => {
  if (!name) return "?";

  const parts = name.split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export function Avatar({ user, size = 40, showStatus = true }: AvatarProps) {
  const backgroundColor = getAvatarColor(user?.id || user?.name);
  const initials = getInitials(user?.name);

  const statusColors = {
    online: "#4CAF50",
    offline: "#9E9E9E",
    away: "#FFC107",
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
        ]}
      >
        <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
          {initials}
        </Text>
      </View>
      {showStatus && user?.status && (
        <View
          style={[
            styles.statusIndicator,
            {
              backgroundColor: statusColors[user.status],
              width: size / 4,
              height: size / 4,
              borderRadius: size / 8,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 40,
  },
  initials: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  statusIndicator: {
    position: "absolute",
    borderWidth: 1.5,
    borderColor: "white",
  },
});
