import React from "react";
import { StyleSheet, TextInput, Pressable } from "react-native";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { IconSymbol } from "@/src/shared/components/ui/IconSymbol";
import { ImagePicker } from "@/src/shared/components/ImagePicker";
import { ImagePreviewWithInput } from "@/src/shared/components/ImagePreviewWithInput";
import { useColorScheme } from "@/src/shared/hooks/useColorScheme";
import { MessageInputProps } from "../types";
import { ImageMedia } from "@/src/shared/types/media";

export function MessageInput({
  onSendMessage,
  onImageWithText,
  placeholder = "Type a message...",
  disabled = false,
}: MessageInputProps) {
  const [messageText, setMessageText] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState<ImageMedia | null>(
    null
  );
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSend = () => {
    if ((messageText.trim() || selectedImage) && !disabled) {
      onSendMessage(messageText.trim());
      setMessageText("");
      setSelectedImage(null);
    }
  };

  const handleImageSelected = (image: ImageMedia) => {
    setSelectedImage(image);
  };

  const handleImageSend = (text: string) => {
    if (selectedImage && onImageWithText) {
      onImageWithText(selectedImage, text);
      setSelectedImage(null);
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
  };

  if (selectedImage) {
    return (
      <ImagePreviewWithInput
        image={selectedImage}
        onSend={handleImageSend}
        onCancel={handleImageCancel}
        placeholder="Add a caption..."
      />
    );
  }

  return (
    <ThemedView style={styles.inputContainer}>
      <ImagePicker onImageSelected={handleImageSelected} disabled={disabled} />
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#2A2C33" : "#FFFFFF",
            borderColor: isDark
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
            color: isDark ? "#FFFFFF" : "#000000",
          },
        ]}
        value={messageText}
        onChangeText={setMessageText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? "#8F8F8F" : "#8F8F8F"}
        multiline
        editable={!disabled}
      />
      <Pressable
        style={[
          styles.sendButton,
          (!messageText.trim() || disabled) && styles.disabledButton,
        ]}
        onPress={handleSend}
        disabled={!messageText.trim() || disabled}
      >
        <IconSymbol name="arrow.up.circle.fill" size={32} color="#007AFF" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    alignItems: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sendButton: {
    marginLeft: 12,
    marginBottom: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
