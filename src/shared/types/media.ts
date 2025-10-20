export interface MediaFile {
  id: string;
  uri: string;
  type: "image" | "video" | "audio" | "document";
  name: string;
  size: number;
  width?: number;
  height?: number;
  thumbnailUri?: string;
  createdAt: number;
}

export interface ImageMedia extends MediaFile {
  type: "image";
  width: number;
  height: number;
  thumbnailUri: string;
  compressedUri?: string;
}

export interface MessageMedia {
  id: string;
  messageId: string;
  mediaType: "image" | "video" | "audio" | "document";
  mediaUri: string;
  thumbnailUri?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    size?: number;
    name?: string;
  };
}

export interface MediaUploadProgress {
  mediaId: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "jpeg" | "png" | "webp";
}

export const DEFAULT_IMAGE_COMPRESSION: ImageCompressionOptions = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  format: "jpeg",
};

export const THUMBNAIL_COMPRESSION: ImageCompressionOptions = {
  maxWidth: 600,
  maxHeight: 600,
  quality: 0.9,
  format: "jpeg",
};
