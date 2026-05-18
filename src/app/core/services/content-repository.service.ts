import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { MOCK_COLLECTIONS, MOCK_MEDIA } from '../data/mock-media.data';
import { environment } from '../../../environments/environment';
import { ContentCollection, ContentMedia } from '../models/content.models';
import { GalleryCollection, GalleryMedia } from '../models/api.models';
import { CollectionService } from './collection.service';
import { MediaService } from './media.service';

@Injectable({ providedIn: 'root' })
export class ContentRepositoryService {
  private readonly mockBase = '/assets/data';

  constructor(
    private readonly http: HttpClient,
    private readonly mediaService: MediaService,
    private readonly collectionService: CollectionService
  ) {}

  getFeaturedMedia(): Observable<ContentMedia[]> {
    if (environment.useMockData) {
      return this.loadMockMedia().pipe(map(items => items.filter(m => m.isFeatured)));
    }
    return this.mediaService.getFeaturedMedia().pipe(
      map(res => this.normalizeMedia(res)),
      catchError(() =>
        this.loadMockMedia().pipe(map(items => items.filter(m => m.isFeatured)))
      )
    );
  }

  getAllMedia(): Observable<ContentMedia[]> {
    if (environment.useMockData) {
      return this.loadMockMedia();
    }
    return this.mediaService.searchMedia('').pipe(
      map(res => this.normalizeMedia(res)),
      catchError(() => this.loadMockMedia())
    );
  }

  searchMedia(query: string, type?: string): Observable<ContentMedia[]> {
    const source$ = environment.useMockData
      ? this.loadMockMedia()
      : this.mediaService.searchMedia(query).pipe(
          map(res => this.normalizeMedia(res)),
          catchError(() => this.loadMockMedia())
        );

    return source$.pipe(
      map(items => {
        let filtered = items;
        const q = query.trim().toLowerCase();
        if (q) {
          filtered = filtered.filter(
            item =>
              item.title.toLowerCase().includes(q) ||
              (item.description?.toLowerCase().includes(q) ?? false) ||
              (item.category?.toLowerCase().includes(q) ?? false)
          );
        }
        if (type && type !== 'all') {
          filtered = filtered.filter(item => item.type === type);
        }
        return filtered;
      })
    );
  }

  getMediaByCollection(collectionId: string): Observable<ContentMedia[]> {
    if (environment.useMockData) {
      return this.loadMockMedia().pipe(
        map(items => items.filter(m => m.collectionId === collectionId))
      );
    }
    return this.mediaService.getMediaByCollection(collectionId).pipe(
      map(res => this.normalizeMedia(res)),
      catchError(() =>
        this.loadMockMedia().pipe(
          map(items => items.filter(m => m.collectionId === collectionId))
        )
      )
    );
  }

  getCollections(): Observable<ContentCollection[]> {
    if (environment.useMockData) {
      return this.loadMockCollections();
    }
    return this.collectionService.getCollections().pipe(
      map(res => this.normalizeCollections(res)),
      catchError(() => this.loadMockCollections())
    );
  }

  getFeaturedCollections(): Observable<ContentCollection[]> {
    if (environment.useMockData) {
      return this.loadMockCollections().pipe(
        map(c => c.filter(item => item.isFeatured))
      );
    }
    return this.collectionService.getFeaturedCollections().pipe(
      map(res => this.normalizeCollections(res)),
      catchError(() =>
        this.loadMockCollections().pipe(map(c => c.filter(item => item.isFeatured)))
      )
    );
  }

  private loadMockMedia(): Observable<ContentMedia[]> {
    return this.http.get<ContentMedia[]>(`${this.mockBase}/media-mock.json`).pipe(
      catchError(() => of([...MOCK_MEDIA]))
    );
  }

  private loadMockCollections(): Observable<ContentCollection[]> {
    return this.http.get<ContentCollection[]>(`${this.mockBase}/collections-mock.json`).pipe(
      catchError(() => of([...MOCK_COLLECTIONS]))
    );
  }

  private normalizeMedia(res: unknown): ContentMedia[] {
    const list = this.normalizeList<GalleryMedia>(res);
    return list.map(item => ({
      id: item.id ?? '',
      title: item.title ?? 'Untitled',
      type: (item.type ?? 'image') as ContentMedia['type'],
      url: item.url ?? '',
      thumbnailUrl: item.thumbnailUrl,
      collectionId: item.collectionId,
      description: item.description,
      isFeatured: item.isFeatured,
      category: item.category
    }));
  }

  private normalizeCollections(res: unknown): ContentCollection[] {
    const list = this.normalizeList<GalleryCollection>(res);
    return list.map(item => ({
      id: item.id ?? '',
      name: item.name ?? item.title ?? 'Collection',
      description: item.description,
      isFeatured: item.isFeatured,
      image: item.image
    }));
  }

  private normalizeList<T>(res: unknown): T[] {
    if (Array.isArray(res)) {
      return res;
    }
    const data = res as { data?: T[]; items?: T[] };
    if (Array.isArray(data?.data)) {
      return data.data;
    }
    if (Array.isArray(data?.items)) {
      return data.items;
    }
    return [];
  }
}
