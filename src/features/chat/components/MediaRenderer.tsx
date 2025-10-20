import React, { useCallback } from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/src/shared/components/ThemedText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { MessageMedia } from "@/src/shared/types";

interface MediaRendererProps {
  media: MessageMedia;
}

export function MediaRenderer({ media }: MediaRendererProps) {
  const renderImage = useCallback(() => {
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
  }, [media]);

  const renderPlaceholder = useCallback(() => {
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
  }, [media.mediaType]);

  if (media.mediaType === "image") {
    return renderImage();
  }

  return renderPlaceholder();
}

const styles = StyleSheet.create({
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
