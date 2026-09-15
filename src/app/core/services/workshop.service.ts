import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { Workshop } from '../models/workshop.model';
import { environment } from '../../../environments/environment';
import { extractData, toCamelCase } from './api-response.helper';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private readonly baseUrl = environment.apiUrl;
  private readonly mockBase = '/assets/data';

  private workshopsSubject = new BehaviorSubject<Workshop[]>([]);
  workshops$ = this.workshopsSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadWorkshops();
  }

  private loadWorkshops(): void {
    this.http.get(`${this.baseUrl}/workshops`).pipe(
      extractData<Workshop[]>(),
      map(toCamelCase<Workshop[]>),
      catchError(() => this.loadMockWorkshops()),
      switchMap(list => (list && list.length ? of(list) : this.loadMockWorkshops()))
    ).subscribe({
      next: workshops => this.workshopsSubject.next(workshops),
      error: () => this.loadMockWorkshops().subscribe(w => this.workshopsSubject.next(w))
    });
  }

  private loadMockWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.mockBase}/workshops.json`).pipe(
      catchError(() => of([]))
    );
  }

  getWorkshops(): Workshop[] {
    return this.workshopsSubject.getValue();
  }

  refreshWorkshops(): void {
    this.loadWorkshops();
  }

  getAllWorkshops(): Observable<Workshop[]> {
    return this.http.get(`${this.baseUrl}/workshops`).pipe(
      extractData<Workshop[]>(),
      map(toCamelCase<Workshop[]>),
      catchError(() => this.loadMockWorkshops()),
      switchMap(list => (list && list.length ? of(list) : this.loadMockWorkshops()))
    );
  }

  getFeaturedWorkshops(): Observable<Workshop[]> {
    return this.http.get(`${this.baseUrl}/workshops/featured`).pipe(
      extractData<Workshop[]>(),
      map(toCamelCase<Workshop[]>),
      catchError(() => this.loadMockWorkshops()),
      switchMap(list => (list && list.length ? of(list) : this.loadMockWorkshops()))
    );
  }

  getWorkshopById(id: string): Observable<Workshop> {
    return this.http.get(`${this.baseUrl}/workshops/${id}`).pipe(
      extractData<Workshop>(),
      map(toCamelCase<Workshop>),
      catchError(() =>
        this.loadMockWorkshops().pipe(
          map(list => {
            const found = list.find(w => w.id === id);
            return found as Workshop;
          })
        )
      )
    );
  }

  addWorkshop(workshop: Omit<Workshop, 'id' | 'createdAt'>): void {
    this.http.post(`${this.baseUrl}/workshops`, workshop).pipe(
      extractData<Workshop>(),
      map(toCamelCase<Workshop>),
      tap(newWorkshop => {
        const workshops = this.workshopsSubject.getValue();
        workshops.unshift(newWorkshop);
        this.workshopsSubject.next([...workshops]);
      })
    ).subscribe();
  }

  updateWorkshop(id: string, updates: Partial<Workshop>): void {
    this.http.put(`${this.baseUrl}/workshops/${id}`, updates).pipe(
      extractData<Workshop>(),
      map(toCamelCase<Workshop>),
      tap(updated => {
        const workshops = this.workshopsSubject.getValue();
        const index = workshops.findIndex(w => w.id === id);
        if (index !== -1) {
          workshops[index] = updated;
          this.workshopsSubject.next([...workshops]);
        }
      })
    ).subscribe();
  }

  deleteWorkshop(id: string): void {
    this.http.delete(`${this.baseUrl}/workshops/${id}`).pipe(
      tap(() => {
        const workshops = this.workshopsSubject.getValue().filter(w => w.id !== id);
        this.workshopsSubject.next(workshops);
      })
    ).subscribe();
  }
}