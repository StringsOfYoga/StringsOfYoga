import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private readonly STORAGE_KEY = 'soy_resources';

  private resourcesSubject = new BehaviorSubject<Resource[]>([]);
  resources$ = this.resourcesSubject.asObservable();

  constructor() {
    this.loadResources();
  }

  private loadResources(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.resourcesSubject.next(JSON.parse(stored));
    } else {
      const mockResources: Resource[] = [
        {
          id: 'r1',
          title: 'Introduction to Yoga Nidra',
          description: 'A comprehensive guide to the practice of conscious deep rest.',
          type: 'youtube',
          mediaUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
          tags: ['yoga-nidra', 'beginner', 'guided'],
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'r2',
          title: 'Breathwork Fundamentals PDF',
          description: 'Downloadable guide covering pranayama techniques for daily practice.',
          type: 'pdf',
          mediaUrl: '',
          publicId: 'soy/resources/breathwork-guide',
          tags: ['breathwork', 'pranayama', 'guide'],
          featured: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'r3',
          title: 'Meditation Soundscape',
          description: 'Ambient audio for deep meditation and relaxation sessions.',
          type: 'audio',
          mediaUrl: '',
          publicId: 'soy/resources/meditation-ambient',
          tags: ['meditation', 'audio', 'ambient'],
          featured: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.resourcesSubject.next(mockResources);
      this.saveResources(mockResources);
    }
  }

  private saveResources(resources: Resource[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(resources));
  }

  getResources(): Resource[] {
    return this.resourcesSubject.getValue();
  }

  getResourceById(id: string): Resource | undefined {
    return this.getResources().find(r => r.id === id);
  }

  addResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): void {
    const resources = this.getResources();
    const now = new Date().toISOString();
    const newResource: Resource = {
      ...resource,
      id: 'r' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    resources.unshift(newResource);
    this.resourcesSubject.next(resources);
    this.saveResources(resources);
  }

  updateResource(id: string, updates: Partial<Resource>): void {
    const resources = this.getResources();
    const index = resources.findIndex(r => r.id === id);
    if (index !== -1) {
      resources[index] = {
        ...resources[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.resourcesSubject.next(resources);
      this.saveResources(resources);
    }
  }

  deleteResource(id: string): void {
    const resources = this.getResources().filter(r => r.id !== id);
    this.resourcesSubject.next(resources);
    this.saveResources(resources);
  }

  toggleFeatured(id: string): void {
    const resources = this.getResources();
    const index = resources.findIndex(r => r.id === id);
    if (index !== -1) {
      resources[index].featured = !resources[index].featured;
      resources[index].updatedAt = new Date().toISOString();
      this.resourcesSubject.next(resources);
      this.saveResources(resources);
    }
  }
}
