import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { ThemedView } from "../components/ThemedView";
import { useColorScheme } from "../hooks/useColorScheme";
import { MediaService } from "../services/MediaService";
import { ImageMedia } from "../types/media";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface ImagePickerProps {
  onImageSelected: (image: ImageMedia) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export function ImagePicker({
  onImageSelected,
  onError,
  disabled = false,
}: ImagePickerProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelection = async (source: "camera" | "gallery") => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    try {
      let image: ImageMedia | null = null;

      if (source === "camera") {
        image = await MediaService.takePhoto();
      } else {
        image = await MediaService.pickImage();
      }

      if (image) {
        if (!MediaService.isFileSizeValid(image.size)) {
          Alert.alert(
            "File Too Large",
            "The selected image is too large. Please choose a smaller image.",
            [{ text: "OK" }]
          );
          return;
        }

        const processed = await MediaService.processImage(image);
        onImageSelected(processed.processedImage);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to select image";
      onError?.(errorMessage);
      Alert.alert("Error", errorMessage, [{ text: "OK" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Select Image",
      "Choose how you want to add an image",
      [
        {
          text: "Camera",
          onPress: () => handleImageSelection("camera"),
        },
        {
          text: "Photo Library",
          onPress: () => handleImageSelection("gallery"),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: disabled ? "#999" : "#007AFF",
        },
        disabled && styles.disabled,
      ]}
      onPress={showImageOptions}
      disabled={disabled}
    >
      <MaterialIcons name="add-photo-alternate" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    backgroundColor: "#007AFF",
  },
});
