import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthRequest } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;
  private token = '';

  constructor(private readonly http: HttpClient) {}

  register(payload: AuthRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  login(payload: AuthRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload).pipe(
      tap((res: any) => {
        const t = res?.token ?? res?.accessToken;
        if (t) {
          this.setToken(t);
        }
      })
    );
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
}
