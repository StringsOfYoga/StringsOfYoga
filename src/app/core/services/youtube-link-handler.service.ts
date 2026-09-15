import { Injectable } from '@angular/core';
import { MediaTypeDetector } from './media-type-detector.service';

export interface VideoEmbedData {
  type: 'youtube' | 'vimeo' | 'external';
  embedUrl: string;
  thumbnailUrl: string;
  videoId: string;
  title?: string;
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeLinkHandler {
  constructor(private detector: MediaTypeDetector) {}

  processVideoUrl(url: string): VideoEmbedData | null {
    const trimmed = url.trim();

    if (this.detector.isYouTubeUrl(trimmed)) {
      return this.processYouTubeUrl(trimmed);
    }

    if (this.detector.isVimeoUrl(trimmed)) {
      return this.processVimeoUrl(trimmed);
    }

    if (this.detector.isExternalVideoUrl(trimmed)) {
      return {
        type: 'external',
        embedUrl: trimmed,
        thumbnailUrl: '',
        videoId: trimmed
      };
    }

    return null;
  }

  private processYouTubeUrl(url: string): VideoEmbedData | null {
    const videoId = this.detector.extractYouTubeId(url);
    if (!videoId) return null;

    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoId
    };
  }

  private processVimeoUrl(url: string): VideoEmbedData | null {
    const videoId = this.detector.extractVimeoId(url);
    if (!videoId) return null;

    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`,
      thumbnailUrl: '',
      videoId
    };
  }

  getYouTubeThumbnail(url: string): string | null {
    const videoId = this.detector.extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  }

  isValidVideoUrl(url: string): boolean {
    return (
      this.detector.isYouTubeUrl(url) ||
      this.detector.isVimeoUrl(url) ||
      this.detector.isExternalVideoUrl(url)
    );
  }
}
