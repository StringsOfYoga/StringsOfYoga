import { Component, OnInit, inject } from '@angular/core';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { WorkshopCard } from '../../shared/components/workshop-card/workshop-card';
import { ContentDataService } from '../../core/services/content-data.service';
import { SeoService } from '../../core/services/seo.service';
import { Workshop } from '../../core/models/content.models';

@Component({
  selector: 'app-workshops',
  imports: [PageHero, WorkshopCard],
  templateUrl: './workshops.html',
  styleUrl: './workshops.scss'
})
export class Workshops implements OnInit {
  private readonly content = inject(ContentDataService);
  private readonly seo = inject(SeoService);
  workshops: Workshop[] = [];
  loading = true;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Workshops',
      description:
        'Calm, supportive workshops for anxiety, depression, and mental wellness—designed to feel safe, not clinical.'
    });
    this.content.getWorkshops().subscribe({
      next: data => {
        this.workshops = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }
}
