import React from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { useColorScheme } from "@/src/shared/hooks/useColorScheme";
import { ImageMedia } from "@/src/shared/types/media";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ImagePreviewWithInputProps {
  image: ImageMedia;
  onSend: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export function ImagePreviewWithInput({
  image,
  onSend,
  onCancel,
  placeholder = "Add a caption...",
}: ImagePreviewWithInputProps) {
  const [text, setText] = React.useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const screenWidth = Dimensions.get("window").width;
  const maxWidth = screenWidth - 32;
  const maxHeight = 300;

  const aspectRatio = image.width / image.height;
  let imageWidth = maxWidth;
  let imageHeight = maxWidth / aspectRatio;

  if (imageHeight > maxHeight) {
    imageHeight = maxHeight;
    imageWidth = maxHeight * aspectRatio;
  }

  const handleSend = () => {
    onSend(text.trim());
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Image",
      "Are you sure you want to cancel sending this image?",
      [
        { text: "Keep Editing", style: "cancel" },
        { text: "Cancel", style: "destructive", onPress: onCancel },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image.thumbnailUri || image.uri }}
          style={[
            styles.previewImage,
            {
              width: imageWidth,
              height: imageHeight,
            },
          ]}
          resizeMode="contain"
        />
        <Pressable style={styles.cancelButton} onPress={handleCancel}>
          <MaterialIcons name="close" size={20} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.textInput,
            {
              backgroundColor: isDark ? "#2A2C33" : "#FFFFFF",
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
              color: isDark ? "#FFFFFF" : "#000000",
            },
          ]}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#8F8F8F" : "#8F8F8F"}
          multiline
          autoFocus
        />
        <Pressable
          style={[styles.sendButton, !text.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!text.trim()}
        >
          <MaterialIcons
            name="send"
            size={24}
            color={text.trim() ? "#007AFF" : "#999"}
          />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  imageContainer: {
    position: "relative",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  previewImage: {
    borderRadius: 12,
    alignSelf: "center",
  },
  cancelButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 12,
  },
  sendButton: {
    padding: 8,
    marginBottom: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
