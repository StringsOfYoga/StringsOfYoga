import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin {
  password = '';
  error = '';
  loading = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  onSubmit(): void {
    this.error = '';
    this.loading = true;

    setTimeout(() => {
      if (this.auth.login(this.password)) {
        this.router.navigate(['/admin']);
      } else {
        this.error = 'Invalid password. Please try again.';
        this.loading = false;
      }
    }, 600);
  }
}
