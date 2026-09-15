import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin implements OnDestroy {
  password = '';
  error = '';
  loading = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    this.error = '';
    this.loading = true;

    this.auth.login(this.password).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.error = 'Invalid password. Please try again.';
        this.loading = false;
      }
    });
  }
}
