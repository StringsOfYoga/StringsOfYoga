import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuthRequest {
  email: string;
  password: string;
  name?: string;
}

export interface CollectionRequest {
  name: string;
  description?: string;
  isFeatured?: boolean;
}

export interface MediaRequest {
  title: string;
  type: 'audio' | 'video' | 'image';
  url: string;
  thumbnailUrl?: string;
  collectionId?: string;
  description?: string;
  isFeatured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AzureFunctionsApiService {
  private readonly baseUrl = 'http://localhost:7027/api';

  constructor(private readonly http: HttpClient) {}

  register(payload: AuthRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  login(payload: AuthRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  createCollection(payload: CollectionRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/collections`, payload);
  }

  getCollections(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collections`);
  }

  getFeaturedCollections(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collections/featured`);
  }

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
