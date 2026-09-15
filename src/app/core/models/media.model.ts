export type MediaType = 'image' | 'video' | 'audio' | 'pdf' | 'document' | 'youtube' | 'vimeo' | 'external' | 'unknown';

export interface MediaFile {
  id: string;
  file?: File;
  name: string;
  type: MediaType;
  mimeType: string;
  size: number;
  url?: string;
  cloudinaryUrl?: string;
  publicId?: string;
  thumbnail?: string;
  preview?: string;
  uploadProgress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  metadata?: Record<string, any>;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resource_type: string;
}

export interface UploadConfig {
  cloudName: string;
  uploadPreset: string;
  maxFileSize: number;
  allowedTypes: MediaType[];
}

export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  cloudName: 'dlldkciug',
  uploadPreset: 'soy_unsigned',
  maxFileSize: 50 * 1024 * 1024,
  allowedTypes: ['image', 'video', 'audio', 'pdf', 'document']
};

export const FILE_TYPE_MAP: Record<string, MediaType> = {
  'image/jpeg': 'image',
  'image/png': 'image',
  'image/gif': 'image',
  'image/webp': 'image',
  'image/svg+xml': 'image',
  'video/mp4': 'video',
  'video/webm': 'video',
  'video/quicktime': 'video',
  'audio/mpeg': 'audio',
  'audio/wav': 'audio',
  'audio/ogg': 'audio',
  'application/pdf': 'pdf',
  'application/msword': 'document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'document',
  'application/vnd.ms-excel': 'document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'document',
  'text/plain': 'document'
};

export const FILE_EXTENSIONS: Record<string, MediaType> = {
  '.jpg': 'image',
  '.jpeg': 'image',
  '.png': 'image',
  '.gif': 'image',
  '.webp': 'image',
  '.svg': 'image',
  '.mp4': 'video',
  '.webm': 'video',
  '.mov': 'video',
  '.mp3': 'audio',
  '.wav': 'audio',
  '.ogg': 'audio',
  '.pdf': 'pdf',
  '.doc': 'document',
  '.docx': 'document',
  '.xls': 'document',
  '.xlsx': 'document',
  '.txt': 'document'
};
