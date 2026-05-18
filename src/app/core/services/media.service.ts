import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MediaRequest } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createMedia(payload: MediaRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/media`, payload);
  }

  deleteMedia(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/media/${id}`);
  }

  getFeaturedMedia(): Observable<any> {
    return this.http.get(`${this.baseUrl}/media/featured`);
  }

  getMediaByCollection(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/media/collection/${id}`);
  }

  searchMedia(query: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/media/search`, {
      params: { q: query }
    });
  }

  getUploadSignature(payload: { fileName: string; fileType: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/media/signature`, payload);
  }
}
