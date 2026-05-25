import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaTypeDetector } from '../../../core/services/media-type-detector.service';
import { MediaFile, MediaType, FILE_TYPE_MAP } from '../../../core/models/media.model';

@Component({
  selector: 'app-upload-dropzone',
  imports: [CommonModule],
  templateUrl: './upload-dropzone.html',
  styleUrl: './upload-dropzone.scss'
})
export class UploadDropzone implements OnInit {
  @Input() allowedTypes: MediaType[] = ['image', 'video', 'audio', 'pdf', 'document'];
  @Input() maxFileSize: number = 50 * 1024 * 1024;
  @Input() multiple = true;
  @Input() label = 'Drop files here or click to upload';
  @Input() accept = '';

  @Output() filesSelected = new EventEmitter<MediaFile[]>();

  isDragging = false;
  error = '';

  constructor(public detector: MediaTypeDetector) {}

  ngOnInit(): void {
    if (!this.accept) {
      this.accept = this.allowedTypes.map(t => this.detector.getMimeType(t)).join(',');
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.processFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      this.processFiles(Array.from(files));
      input.value = '';
    }
  }

  private processFiles(files: File[]): void {
    this.error = '';
    const validFiles: MediaFile[] = [];

    for (const file of files) {
      if (!this.detector.isValidFileSize(file, this.maxFileSize)) {
        this.error = `${file.name} exceeds the maximum file size of ${this.detector.formatFileSize(this.maxFileSize)}`;
        continue;
      }

      if (!this.detector.isValidFileType(file, this.allowedTypes)) {
        this.error = `${file.name} is not an allowed file type`;
        continue;
      }

      const mediaFile: MediaFile = {
        id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        type: this.detector.detect(file),
        mimeType: file.type,
        size: file.size,
        uploadProgress: 0,
        status: 'pending'
      };

      this.generatePreview(mediaFile);
      validFiles.push(mediaFile);
    }

    if (validFiles.length > 0) {
      this.filesSelected.emit(validFiles);
    }
  }

  private generatePreview(mediaFile: MediaFile): void {
    if (!mediaFile.file) return;

    if (mediaFile.type === 'image') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        mediaFile.preview = e.target.result;
      };
      reader.readAsDataURL(mediaFile.file);
    } else if (mediaFile.type === 'video') {
      const url = URL.createObjectURL(mediaFile.file);
      mediaFile.preview = url;
    } else if (mediaFile.type === 'pdf') {
      mediaFile.preview = 'assets/icons/pdf-icon.svg';
    }
  }
}
