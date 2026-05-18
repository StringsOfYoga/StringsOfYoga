import { Component, OnInit, inject } from '@angular/core';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { CourseCard } from '../../shared/components/course-card/course-card';
import { ContentDataService } from '../../core/services/content-data.service';
import { SeoService } from '../../core/services/seo.service';
import { Course } from '../../core/models/content.models';

@Component({
  selector: 'app-courses',
  imports: [PageHero, CourseCard],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {
  private readonly content = inject(ContentDataService);
  private readonly seo = inject(SeoService);
  courses: Course[] = [];
  loading = true;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Courses',
      description:
        'Yog Nidra, Hatha, pregnancy yoga, restorative sessions, and breathwork—gentle formats for every body.'
    });
    this.content.getCourses().subscribe({
      next: data => {
        this.courses = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
