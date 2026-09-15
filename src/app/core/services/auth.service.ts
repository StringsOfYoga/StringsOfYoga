import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { extractData } from './api-response.helper';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'soy_admin_auth';
  private authenticated = false;

  constructor(private readonly http: HttpClient) {}

  login(password: string): Observable<{ token: string; expiresIn: number }> {
    return this.http.post(`${environment.apiUrl}/auth/login`, { password }).pipe(
      extractData<{ token: string; expiresIn: number }>(),
      tap(res => {
        this.authenticated = true;
        localStorage.setItem(this.TOKEN_KEY, res.token);
      })
    );
  }

  logout(): void {
    this.authenticated = false;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    if (this.authenticated) return true;
    const token = localStorage.getItem(this.TOKEN_KEY);
    this.authenticated = !!token;
    return this.authenticated;
  }

  requireAuth(): boolean {
    return this.isAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
