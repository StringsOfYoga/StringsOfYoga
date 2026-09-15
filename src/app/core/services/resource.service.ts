import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Resource } from '../models/resource.model';
import { environment } from '../../../environments/environment';
import { extractData, toCamelCase } from './api-response.helper';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private readonly baseUrl = environment.apiUrl;

  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  resources$ = this.resourcesSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadResources();
  }

  private loadResources(): void {
    this.http.get(`${this.baseUrl}/resources`).pipe(
      extractData<Resource[]>(),
      map(toCamelCase<Resource[]>)
    ).subscribe({
      next: resources => this.resourcesSubject.next(resources),
      error: () => this.resourcesSubject.next([])
    });
  }

  getResources(): Resource[] {
    return this.resourcesSubject.getValue();
  }

  getResourceById(id: string): Observable<Resource> {
    return this.http.get(`${this.baseUrl}/resources/${id}`).pipe(
      extractData<Resource>(),
      map(toCamelCase<Resource>)
    );
  }

  addResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.http.post(`${this.baseUrl}/resources`, resource).pipe(
      extractData<Resource>(),
      map(toCamelCase<Resource>),
      tap(newResource => {
        const resources = this.resourcesSubject.getValue();
        resources.unshift(newResource);
        this.resourcesSubject.next([...resources]);
      })
    ).subscribe();
  }

  updateResource(id: string, updates: Partial<Resource>): void {
    this.http.put(`${this.baseUrl}/resources/${id}`, updates).pipe(
      extractData<Resource>(),
      map(toCamelCase<Resource>),
      tap(updated => {
        const resources = this.resourcesSubject.getValue();
        const index = resources.findIndex(r => r.id === id);
        if (index !== -1) {
          resources[index] = updated;
          this.resourcesSubject.next([...resources]);
        }
      })
    ).subscribe();
  }

  deleteResource(id: string): void {
    this.http.delete(`${this.baseUrl}/resources/${id}`).pipe(
      tap(() => {
        const resources = this.resourcesSubject.getValue().filter(r => r.id !== id);
        this.resourcesSubject.next(resources);
      })
    ).subscribe();
  }

  toggleFeatured(id: string): void {
    const resources = this.resourcesSubject.getValue();
    const resource = resources.find(r => r.id === id);
    if (resource) {
      this.updateResource(id, { featured: !resource.featured });
    }
  }
}
