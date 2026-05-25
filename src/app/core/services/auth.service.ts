import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly MOCK_PASSWORD = 'admin123';
  private authenticated = false;

  login(password: string): boolean {
    if (password === this.MOCK_PASSWORD) {
      this.authenticated = true;
      localStorage.setItem('soy_admin_auth', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.authenticated = false;
    localStorage.removeItem('soy_admin_auth');
  }

  isAuthenticated(): boolean {
    if (this.authenticated) return true;
    const stored = localStorage.getItem('soy_admin_auth');
    this.authenticated = stored === 'true';
    return this.authenticated;
  }

  requireAuth(): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }
    return true;
  }

  getToken(): string | null {
    return this.isAuthenticated() ? localStorage.getItem('soy_admin_auth') : null;
  }
}
