import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-placeholder',
  template: `
    <div class="placeholder-page">
      <div class="placeholder-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h2>{{ sectionName }}</h2>
      <p>This section is under development. Check back soon.</p>
    </div>
  `,
  styles: [`
    .placeholder-page {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--card-bg);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(0, 0, 0, 0.04);
    }
    .placeholder-icon {
      color: var(--light-text-color);
      margin-bottom: 1.5rem;
    }
    h2 {
      font-family: var(--heading-font);
      font-size: 1.5rem;
      font-weight: 400;
      color: var(--dark-text-color);
      margin: 0 0 0.5rem;
    }
    p {
      color: var(--body-text-color);
      margin: 0;
    }
  `]
})
export class AdminPlaceholder implements OnInit {
  sectionName = 'Section';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.sectionName = data['sectionName'] || 'Section';
    });
  }
}
