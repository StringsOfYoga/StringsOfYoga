import { Component, OnInit, inject } from '@angular/core';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { TestimonialCard } from '../../shared/components/testimonial-card/testimonial-card';
import { ContentDataService } from '../../core/services/content-data.service';
import { SeoService } from '../../core/services/seo.service';
import { Testimonial } from '../../core/models/content.models';

@Component({
  selector: 'app-testimonials',
  imports: [PageHero, TestimonialCard],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss'
})
export class Testimonials implements OnInit {
  private readonly content = inject(ContentDataService);
  private readonly seo = inject(SeoService);
  testimonials: Testimonial[] = [];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Testimonials',
      description: 'Stories from practitioners who found calm, rest, and reconnection through Strings of Yoga.'
    });
    this.content.getTestimonials().subscribe(data => (this.testimonials = data));
  }
}
