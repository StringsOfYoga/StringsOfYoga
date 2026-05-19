import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  readonly navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/about', label: 'About', exact: false },
    { path: '/courses', label: 'Courses', exact: false },
    { path: '/workshops', label: 'Workshops', exact: false },
    { path: '/resources', label: 'Resources', exact: false },
    { path: '/blog', label: 'Blog', exact: false },
    { path: '/contact', label: 'Contact', exact: false }
  ];

  mobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }
}
