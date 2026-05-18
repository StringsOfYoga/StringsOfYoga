import { AfterViewInit, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

declare const jQuery: { (selector: string): { stellarNav: (opts: object) => void } };

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements AfterViewInit {
  readonly navItems = [
    { path: '/', label: 'Home', exact: true },
    { path: '/about', label: 'About', exact: false },
    { path: '/courses', label: 'Courses', exact: false },
    { path: '/workshops', label: 'Workshops', exact: false },
    { path: '/resources', label: 'Resources', exact: false },
    // { path: '/testimonials', label: 'Testimonials', exact: false },
    { path: '/blog', label: 'Blog', exact: false },
    { path: '/contact', label: 'Contact', exact: false }
  ];

  ngAfterViewInit(): void {
    jQuery('.stellarnav').stellarNav({
      theme: 'plain',
      closingDelay: 250
    });
  }
}
