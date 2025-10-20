import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
  ImageMedia,
  ImageCompressionOptions,
  DEFAULT_IMAGE_COMPRESSION,
  THUMBNAIL_COMPRESSION,
} from "../types/media";

export class MediaService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      return (
        cameraPermission.status === "granted" &&
        mediaLibraryPermission.status === "granted"
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Pick an image from the device
   */
  static async pickImage(): Promise<ImageMedia | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Camera and media library permissions are required");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets?.[0]) {
        return null;
      }

      const asset = result.assets[0];

      return {
        id: this.generateMediaId(),
        uri: asset.uri,
        type: "image",
        name: asset.fileName || `image_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        width: asset.width,
        height: asset.height,
        thumbnailUri: asset.uri,
        createdAt: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Take a photo with the camera
   */
  static async takePhoto(): Promise<ImageMedia | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Camera and media library permissions are required");
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        exif: false,
      });

      if (result.canceled || !result.assets?.[0]) {
        return null;
      }

      const asset = result.assets[0];

      return {
        id: this.generateMediaId(),
        uri: asset.uri,
        type: "image",
        name: asset.fileName || `photo_${Date.now()}.jpg`,
        size: asset.fileSize || 0,
        width: asset.width,
        height: asset.height,
        thumbnailUri: asset.uri,
        createdAt: Date.now(),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Compress an image with the given options
   */
  static async compressImage(
    imageUri: string,
    options: ImageCompressionOptions = DEFAULT_IMAGE_COMPRESSION
  ): Promise<string> {
    try {
      const actions: ImageManipulator.Action[] = [];

      if (options.maxWidth || options.maxHeight) {
        actions.push({
          resize: {
            width: options.maxWidth,
            height: options.maxHeight,
          },
        });
      }

      const result = await ImageManipulator.manipulateAsync(imageUri, actions, {
        compress: options.quality || DEFAULT_IMAGE_COMPRESSION.quality,
        format: ImageManipulator.SaveFormat.JPEG,
      });

      return result.uri;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a thumbnail for an image
   */
  static async createThumbnail(imageUri: string): Promise<string> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: THUMBNAIL_COMPRESSION.maxWidth,
              height: THUMBNAIL_COMPRESSION.maxHeight,
            },
          },
        ],
        {
          compress: THUMBNAIL_COMPRESSION.quality,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      return result.uri;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Process an image: compress it and create a thumbnail
   */
  static async processImage(imageMedia: ImageMedia): Promise<{
    compressedUri: string;
    thumbnailUri: string;
    processedImage: ImageMedia;
  }> {
    try {
      const compressedUri = await this.compressImage(imageMedia.uri);

      const thumbnailUri = await this.createThumbnail(imageMedia.uri);

      const processedImage: ImageMedia = {
        ...imageMedia,
        compressedUri,
        thumbnailUri,
      };

      return {
        compressedUri,
        thumbnailUri,
        processedImage,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get image dimensions from URI
   */
  static async getImageDimensions(
    uri: string
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = reject;
      img.src = uri;
    });
  }

  /**
   * Generate a unique media ID
   */
  private static generateMediaId(): string {
    return `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  /**
   * Check if file size is within limits
   */
  static isFileSizeValid(size: number, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }
}
