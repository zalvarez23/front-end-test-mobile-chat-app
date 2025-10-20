import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { View, StyleSheet, Pressable, Animated, Image } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { MessageStatus } from "./MessageStatus";
import { MessageActions } from "./MessageActions";
import { useColorScheme } from "@/src/shared/hooks/useColorScheme";
import { MessageBubbleProps } from "../types";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export function MessageBubble({
  message,
  isCurrentUser,
  onEditMessage,
  onDeleteMessage,
  totalParticipants = 0,
  isEditing = false,
}: MessageBubbleProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showActions, setShowActions] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const formatTime = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, []);

  const handleLongPress = useCallback(() => {
    if (isCurrentUser && (onEditMessage || onDeleteMessage)) {
      setShowActions(true);
    }
  }, [isCurrentUser, onEditMessage, onDeleteMessage]);

  const handleEdit = useCallback(() => {
    onEditMessage?.(message.id, message.text);
  }, [onEditMessage, message.id, message.text]);

  const handleDelete = useCallback(() => {
    onDeleteMessage?.(message.id);
  }, [onDeleteMessage, message.id]);

  const renderMedia = useCallback(() => {
    if (!message.hasMedia || !message.media) return null;

    const { media } = message;

    if (media.mediaType === "image") {
      const aspectRatio =
        media.metadata?.width && media.metadata?.height
          ? media.metadata.width / media.metadata.height
          : 1;

      const maxWidth = 280;
      const maxHeight = 400;

      let imageWidth = maxWidth;
      let imageHeight = maxWidth / aspectRatio;

      if (imageHeight > maxHeight) {
        imageHeight = maxHeight;
        imageWidth = maxHeight * aspectRatio;
      }

      return (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: media.thumbnailUri || media.mediaUri }}
            style={[
              styles.mediaImage,
              {
                width: imageWidth,
                height: imageHeight,
              },
            ]}
            resizeMode="contain"
          />
          <View style={styles.mediaOverlay}>
            <MaterialIcons name="image" size={16} color="#FFFFFF" />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.mediaContainer}>
        <View style={styles.mediaPlaceholder}>
          <MaterialIcons
            name={media.mediaType === "video" ? "videocam" : "attach-file"}
            size={24}
            color="#999"
          />
          <ThemedText style={styles.mediaPlaceholderText}>
            {media.mediaType.toUpperCase()}
          </ThemedText>
        </View>
      </View>
    );
  }, [message.hasMedia, message.media]);

  const bubbleStyle = useMemo(
    () => [
      styles.bubble,
      isCurrentUser
        ? [
            styles.selfBubble,
            { backgroundColor: isDark ? "#235A4A" : "#DCF8C6" },
          ]
        : [
            styles.otherBubble,
            { backgroundColor: isDark ? "#2A2C33" : "#FFFFFF" },
          ],
      isEditing && styles.editingBubble,
    ],
    [isCurrentUser, isDark, isEditing]
  );

  const containerStyle = useMemo(
    () => [
      styles.container,
      isCurrentUser ? styles.selfContainer : styles.otherContainer,
    ],
    [isCurrentUser]
  );

  const messageTextStyle = useMemo(
    () => [
      styles.messageText,
      isCurrentUser && !isDark && styles.selfMessageText,
    ],
    [isCurrentUser, isDark]
  );

  return (
    <>
      <Animated.View
        style={[
          containerStyle,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Pressable onLongPress={handleLongPress}>
          <View style={bubbleStyle}>
            {renderMedia()}
            {message.text && (
              <ThemedText style={messageTextStyle}>{message.text}</ThemedText>
            )}
            {message.editedAt && (
              <ThemedText style={styles.editedIndicator}>(edited)</ThemedText>
            )}
            <View style={styles.footerContainer}>
              <ThemedText style={styles.timeText}>
                {formatTime(message.timestamp)}
              </ThemedText>
              {isCurrentUser && (
                <MessageStatus
                  status={message.status}
                  readBy={message.readBy}
                  totalParticipants={totalParticipants}
                />
              )}
            </View>
          </View>
          <MessageActions
            isCurrentUser={isCurrentUser}
            onEdit={onEditMessage ? handleEdit : undefined}
            onDelete={onDeleteMessage ? handleDelete : undefined}
            showActions={showActions}
            onClose={() => setShowActions(false)}
          />
        </Pressable>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  selfContainer: {
    alignSelf: "flex-end",
  },
  otherContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selfBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  selfMessageText: {
    color: "#000000",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    opacity: 0.7,
  },
  editedIndicator: {
    fontSize: 10,
    opacity: 0.6,
    fontStyle: "italic",
    marginTop: 2,
  },
  editingBubble: {
    borderWidth: 2,
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  mediaContainer: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  mediaImage: {
    borderRadius: 8,
  },
  mediaOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
  },
  mediaPlaceholder: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  mediaPlaceholderText: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
  },
});
