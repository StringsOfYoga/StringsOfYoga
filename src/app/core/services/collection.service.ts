import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CollectionRequest } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  createCollection(payload: CollectionRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/collections`, payload);
  }

  getCollections(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collections`);
  }

  getFeaturedCollections(): Observable<any> {
    return this.http.get(`${this.baseUrl}/collections/featured`);
  }
}
