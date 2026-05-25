import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workshop } from '../models/workshop.model';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private readonly STORAGE_KEY = 'soy_workshops';

  private workshopsSubject = new BehaviorSubject<Workshop[]>([]);
  workshops$ = this.workshopsSubject.asObservable();

  constructor() {
    this.loadWorkshops();
  }

  private loadWorkshops(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.workshopsSubject.next(JSON.parse(stored));
    } else {
      const mockWorkshops: Workshop[] = [
        {
          id: 'w1',
          title: 'Equinox Retreat',
          description: 'A 7-day immersive journey of renewal and deep rest in the heart of Sedona.',
          date: '2026-03-12',
          time: '09:00 AM',
          location: 'Sedona, Arizona',
          coverImage: 'download2.jpg',
          ctaText: 'Reserve Spot',
          ctaLink: '/workshops',
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'w2',
          title: 'Yoga Nidra Intensive',
          description: 'A 4-hour online masterclass exploring the depths of conscious rest.',
          date: '2026-06-05',
          time: '10:00 AM',
          location: 'Online Masterclass',
          coverImage: 'download3.jpg',
          ctaText: 'Reserve Spot',
          ctaLink: '/workshops',
          featured: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'w3',
          title: 'Breathwork & Stillness',
          description: 'An evening of guided breathwork and meditation for inner calm.',
          date: '2026-04-20',
          time: '06:00 PM',
          location: 'Studio, New York',
          coverImage: 'download4.jpg',
          ctaText: 'Reserve Spot',
          ctaLink: '/workshops',
          featured: false,
          createdAt: new Date().toISOString()
        }
      ];
      this.workshopsSubject.next(mockWorkshops);
      this.saveWorkshops(mockWorkshops);
    }
  }

  private saveWorkshops(workshops: Workshop[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workshops));
  }

  getWorkshops(): Workshop[] {
    return this.workshopsSubject.getValue();
  }

  getFeaturedWorkshops(): Workshop[] {
    return this.getWorkshops()
      .filter(w => w.featured)
      .slice(0, 3);
  }

  getWorkshopById(id: string): Workshop | undefined {
    return this.getWorkshops().find(w => w.id === id);
  }

  addWorkshop(workshop: Omit<Workshop, 'id' | 'createdAt'>): void {
    const workshops = this.getWorkshops();
    const newWorkshop: Workshop = {
      ...workshop,
      id: 'w' + Date.now(),
      createdAt: new Date().toISOString()
    };
    workshops.unshift(newWorkshop);
    this.workshopsSubject.next(workshops);
    this.saveWorkshops(workshops);
  }

  updateWorkshop(id: string, updates: Partial<Workshop>): void {
    const workshops = this.getWorkshops();
    const index = workshops.findIndex(w => w.id === id);
    if (index !== -1) {
      workshops[index] = { ...workshops[index], ...updates };
      this.workshopsSubject.next(workshops);
      this.saveWorkshops(workshops);
    }
  }

  deleteWorkshop(id: string): void {
    const workshops = this.getWorkshops().filter(w => w.id !== id);
    this.workshopsSubject.next(workshops);
    this.saveWorkshops(workshops);
  }
}
