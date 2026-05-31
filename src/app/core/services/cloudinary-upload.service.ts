import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { filter, map, catchError, tap } from 'rxjs/operators';
import { CloudinaryUploadResult, UploadConfig, DEFAULT_UPLOAD_CONFIG } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryUploadService {
  private config: UploadConfig = DEFAULT_UPLOAD_CONFIG;

  constructor(private http: HttpClient) {}

  configure(config: Partial<UploadConfig>): void {
    this.config = { ...this.config, ...config };
  }

  uploadFile(file: File, folder: string = 'soy', onProgress?: (progress: number) => void): Observable<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.config.uploadPreset);
    formData.append('folder', folder);

    const url = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/auto/upload`;

    return this.http.post<CloudinaryUploadResult>(url, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      tap(event => {
        if (event.type === HttpEventType.UploadProgress && onProgress) {
          onProgress(Math.round((event.loaded / (event.total || 1)) * 100));
        }
      }),
      filter(event => event.type === HttpEventType.Response),
      map(event => (event as HttpResponse<CloudinaryUploadResult>).body as CloudinaryUploadResult),
      catchError(error => {
        return throwError(() => new Error(`Cloudinary upload failed: ${error.message}`));
      })
    );
  }

  uploadMultiple(files: File[], folder: string = 'soy'): Observable<CloudinaryUploadResult[]> {
    const uploads = files.map(file => this.uploadFile(file, folder));
    return new Observable<CloudinaryUploadResult[]>(observer => {
      const results: CloudinaryUploadResult[] = [];
      let completed = 0;

      uploads.forEach((upload$, index) => {
        upload$.subscribe({
          next: result => {
            results[index] = result;
            completed++;
            if (completed === files.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: err => observer.error(err)
        });
      });
    });
  }

  getOptimizedUrl(publicId: string, options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}): string {
    const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options;
    let transformations = `f_${format},q_${quality},c_${crop}`;

    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;

    return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/${transformations}/${publicId}`;
  }

  getVideoUrl(publicId: string, options: {
    width?: number;
    height?: number;
    quality?: string;
  } = {}): string {
    const { width, height, quality = 'auto' } = options;
    let transformations = `q_${quality}`;

    if (width) transformations += `,w_${width}`;
    if (height) transformations += `,h_${height}`;

    return `https://res.cloudinary.com/${this.config.cloudName}/video/upload/${transformations}/${publicId}`;
  }

  destroy(publicId: string): Observable<any> {
    return throwError(() => new Error('Destroy requires backend authentication'));
  }
}
