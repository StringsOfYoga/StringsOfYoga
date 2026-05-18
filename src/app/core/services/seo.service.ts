import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly siteName = 'Strings of Yoga';

  setPage(meta: {
    title: string;
    description: string;
    path?: string;
    image?: string;
  }): void {
    const fullTitle = `${meta.title} | ${this.siteName}`;
    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: meta.description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: meta.description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    if (meta.path) {
      this.meta.updateTag({ property: 'og:url', content: meta.path });
    }
    if (meta.image) {
      this.meta.updateTag({ property: 'og:image', content: meta.image });
    }
  }
}
