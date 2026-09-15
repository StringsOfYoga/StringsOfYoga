import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

const STORAGE_KEY = 'soy_cookie_consent';

@Component({
  selector: 'app-cookie-consent',
  imports: [RouterLink],
  templateUrl: './cookie-consent.html',
  styleUrl: './cookie-consent.scss'
})
export class CookieConsent {
  visible = signal(!localStorage.getItem(STORAGE_KEY));

  accept(): void {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    this.visible.set(false);
  }

  reject(): void {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    this.visible.set(false);
  }
}
