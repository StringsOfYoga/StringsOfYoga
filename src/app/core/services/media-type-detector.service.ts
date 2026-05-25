import { Injectable } from '@angular/core';
import { MediaType, FILE_TYPE_MAP, FILE_EXTENSIONS } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaTypeDetector {
  detect(fileOrUrl: File | string): MediaType {
    if (fileOrUrl instanceof File) {
      return this.detectFromFile(fileOrUrl);
    }
    return this.detectFromUrl(fileOrUrl);
  }

  private detectFromFile(file: File): MediaType {
    if (file.type && FILE_TYPE_MAP[file.type]) {
      return FILE_TYPE_MAP[file.type];
    }

    const extension = this.getExtension(file.name);
    if (extension && FILE_EXTENSIONS[extension]) {
      return FILE_EXTENSIONS[extension];
    }

    return 'unknown';
  }

  private detectFromUrl(url: string): MediaType {
    const trimmed = url.trim();

    if (this.isYouTubeUrl(trimmed)) {
      return 'youtube';
    }

    if (this.isVimeoUrl(trimmed)) {
      return 'vimeo';
    }

    if (this.isExternalVideoUrl(trimmed)) {
      return 'video';
    }

    if (this.isExternalAudioUrl(trimmed)) {
      return 'audio';
    }

    const extension = this.getExtension(trimmed);
    if (extension && FILE_EXTENSIONS[extension]) {
      return FILE_EXTENSIONS[extension];
    }

    return 'external';
  }

  isYouTubeUrl(url: string): boolean {
    const patterns = [
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtu\.be\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/[\w-]+/,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/[\w-]+/
    ];
    return patterns.some(pattern => pattern.test(url));
  }

  isVimeoUrl(url: string): boolean {
    return /^(https?:\/\/)?(www\.)?vimeo\.com\/[\d]+/.test(url);
  }

  isExternalVideoUrl(url: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  }

  isExternalAudioUrl(url: string): boolean {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.aac', '.flac'];
    return audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
  }

  getExtension(filename: string): string {
    const match = filename.match(/\.([a-zA-Z0-9]+)$/);
    return match ? '.' + match[1].toLowerCase() : '';
  }

  getMimeType(mediaType: MediaType): string {
    const mimeMap: Record<MediaType, string> = {
      'image': 'image/*',
      'video': 'video/*',
      'audio': 'audio/*',
      'pdf': 'application/pdf',
      'document': 'application/msword,application/vnd.openxmlformats-officedocument.*,text/plain',
      'youtube': 'text/url',
      'vimeo': 'text/url',
      'external': '*/*',
      'unknown': '*/*'
    };
    return mimeMap[mediaType] || '*/*';
  }

  isValidFileType(file: File, allowedTypes: MediaType[]): boolean {
    const detected = this.detectFromFile(file);
    return allowedTypes.includes(detected);
  }

  isValidFileSize(file: File, maxSizeBytes: number): boolean {
    return file.size <= maxSizeBytes;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  extractYouTubeId(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/,
      /^([\w-]{11})$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  extractVimeoId(url: string): string | null {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  }
}
