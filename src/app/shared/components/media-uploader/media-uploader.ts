import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadDropzone } from '../upload-dropzone/upload-dropzone';
import { MediaFile, MediaType, CloudinaryUploadResult } from '../../../core/models/media.model';
import { CloudinaryUploadService } from '../../../core/services/cloudinary-upload.service';
import { MediaTypeDetector } from '../../../core/services/media-type-detector.service';
import { YoutubeLinkHandler } from '../../../core/services/youtube-link-handler.service';

@Component({
  selector: 'app-media-uploader',
  imports: [CommonModule, FormsModule, UploadDropzone],
  templateUrl: './media-uploader.html',
  styleUrl: './media-uploader.scss'
})
export class MediaUploader implements OnInit {
  @Input() allowedTypes: MediaType[] = ['image', 'video', 'audio', 'pdf', 'document'];
  @Input() maxFileSize: number = 50 * 1024 * 1024;
  @Input() multiple = true;
  @Input() label = 'Upload Media';
  @Input() folder = 'soy';
  @Input() hideUrlTab = false;
  @Output() mediaUploaded = new EventEmitter<MediaFile[]>();
  @Output() mediaRemoved = new EventEmitter<string>();

  mediaFiles: MediaFile[] = [];
  youtubeUrl = '';
  youtubeError = '';
  activeTab: 'upload' | 'url' = 'upload';

  get showUrlTab(): boolean {
    return !this.hideUrlTab && this.allowedTypes.includes('video');
  }

  constructor(
    public cloudinary: CloudinaryUploadService,
    public detector: MediaTypeDetector,
    public youtubeHandler: YoutubeLinkHandler
  ) {}

  ngOnInit(): void {}

  onFilesSelected(files: MediaFile[]): void {
    this.mediaFiles = [...this.mediaFiles, ...files];
    this.uploadFiles(files);
  }

  async uploadFiles(files: MediaFile[]): Promise<void> {
    for (const mediaFile of files) {
      if (!mediaFile.file) continue;

      mediaFile.status = 'uploading';
      mediaFile.uploadProgress = 0;

      try {
        const result = await this.cloudinary.uploadFile(mediaFile.file, this.folder).toPromise();

        if (result) {
          mediaFile.cloudinaryUrl = result.secure_url;
          mediaFile.publicId = result.public_id;
          mediaFile.status = 'success';
          mediaFile.uploadProgress = 100;
          mediaFile.metadata = {
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            resourceType: result.resource_type
          };
        }
      } catch (error: any) {
        mediaFile.status = 'error';
        mediaFile.error = error.message || 'Upload failed';
      }
    }

    this.mediaUploaded.emit(this.mediaFiles.filter(f => f.status === 'success'));
  }

  addYoutubeUrl(): void {
    this.youtubeError = '';

    if (!this.youtubeUrl.trim()) {
      this.youtubeError = 'Please enter a valid URL';
      return;
    }

    const embedData = this.youtubeHandler.processVideoUrl(this.youtubeUrl);

    if (!embedData) {
      this.youtubeError = 'Unsupported video URL. Please use YouTube or Vimeo links.';
      return;
    }

    const mediaFile: MediaFile = {
      id: 'media-' + Date.now(),
      name: embedData.videoId,
      type: embedData.type === 'youtube' ? 'youtube' : embedData.type === 'vimeo' ? 'vimeo' : 'video',
      mimeType: 'video/url',
      size: 0,
      url: this.youtubeUrl,
      cloudinaryUrl: embedData.embedUrl,
      thumbnail: embedData.thumbnailUrl,
      preview: embedData.thumbnailUrl,
      uploadProgress: 100,
      status: 'success',
      metadata: {
        videoId: embedData.videoId,
        embedUrl: embedData.embedUrl,
        type: embedData.type
      }
    };

    this.mediaFiles.push(mediaFile);
    this.mediaUploaded.emit([mediaFile]);
    this.youtubeUrl = '';
  }

  removeMedia(id: string): void {
    this.mediaFiles = this.mediaFiles.filter(f => f.id !== id);
    this.mediaRemoved.emit(id);
  }

  retryUpload(mediaFile: MediaFile): void {
    if (mediaFile.file) {
      this.uploadFiles([mediaFile]);
    }
  }

  getAcceptedLabel(): string {
    return this.allowedTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
  }
}
