import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { AdminAssistant } from '../../../shared/components/admin-assistant/admin-assistant';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink, RouterOutlet, CommonModule, AdminAssistant],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  sidebarOpen = false;
  activeTab = 'workshops';

  navItems = [
    { id: 'workshops', label: 'Workshops', icon: 'calendar', path: '/admin/workshops' },
    { id: 'resources', label: 'Resources', icon: 'book', path: '/admin/resources' },
    { id: 'courses', label: 'Courses', icon: 'play', path: '/admin/courses' },
    { id: 'blog', label: 'Blog', icon: 'file', path: '/admin/blog' },
    { id: 'featured', label: 'Featured', icon: 'star', path: '/admin/featured' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/admin/settings' }
  ];

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/admin/login']);
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    this.sidebarOpen = false;
  }
}
