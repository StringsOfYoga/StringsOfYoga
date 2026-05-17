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
        slogan: 'Find your flow, 1 string at a time.',
        mission: 'To create calm and comforting spaces where we feel to heal.',
        vision:
          'We are committed to guide people in reconnecting with themselves and calming one string at a time.',
        email: 'hello@stringsofyoga.com',
        phone: ''
      },
      about: {
        headline: 'Guiding you home, one breath at a time',
        story: '',
        philosophy: '',
        image: '/assets/images/footer-bg.png'
      },
      heroSlides: [],
      quote: { text: '', author: '' }
    };
  }
}
