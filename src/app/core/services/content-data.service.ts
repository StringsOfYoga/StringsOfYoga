import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import {
  BlogPost,
  Course,
  SiteContent,
  Testimonial,
  Workshop
} from '../models/content.models';

@Injectable({ providedIn: 'root' })
export class ContentDataService {
  private readonly base = '/assets/data';
  private siteContent$?: Observable<SiteContent>;

  constructor(private readonly http: HttpClient) {}

  getSiteContent(): Observable<SiteContent> {
    if (!this.siteContent$) {
      this.siteContent$ = this.http
        .get<SiteContent>(`${this.base}/site-content.json`)
        .pipe(shareReplay(1), catchError(() => of(this.fallbackSiteContent())));
    }
    return this.siteContent$;
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.base}/courses.json`).pipe(
      catchError(() => of([]))
    );
  }

  getWorkshops(): Observable<Workshop[]> {
    return this.http.get<Workshop[]>(`${this.base}/workshops.json`).pipe(
      catchError(() => of([]))
    );
  }

  getTestimonials(): Observable<Testimonial[]> {
    return this.http.get<Testimonial[]>(`${this.base}/testimonials.json`).pipe(
      catchError(() => of([]))
    );
  }

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http.get<BlogPost[]>(`${this.base}/blog-posts.json`).pipe(
      catchError(() => of([]))
    );
  }

  getBlogPostBySlug(slug: string): Observable<BlogPost | undefined> {
    return this.getBlogPosts().pipe(
      map(posts => posts.find(p => p.slug === slug))
    );
  }

  private fallbackSiteContent(): SiteContent {
    return {
      brand: {
        name: 'Strings of Yoga',
        slogan: 'Move • Breathe • Restore • Thrive',
        mission: 'To make yoga accessible to everyone through practical tools that support physical health, mental wellbeing, resilience, relaxation, and personal growth.',
        vision:
          'To create a welcoming and supportive space where people can reconnect with themselves and discover practices that nurture health, balance, and inner wellbeing.',
        email: 'info.stringsofyoga@gmail.com',
        phone: ''
      },
      about: {
        headline: 'Meet Renu',
        story: '',
        philosophy: '',
        image: '/assets/images/footer-bg.png'
      },
      heroSlides: [],
      quote: { text: '', author: '' }
    };
  }
}
