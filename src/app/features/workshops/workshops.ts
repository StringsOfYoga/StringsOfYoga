import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { WorkshopService } from '../../core/services/workshop.service';
import { SeoService } from '../../core/services/seo.service';
import { Workshop } from '../../core/models/workshop.model';

@Component({
  selector: 'app-workshops',
  imports: [DatePipe, RouterLink, PageHero],
  templateUrl: './workshops.html',
  styleUrl: './workshops.scss'
})
export class Workshops implements OnInit {
  private readonly workshopService = inject(WorkshopService);
  private readonly seo = inject(SeoService);
  workshops: Workshop[] = [];
  loading = true;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Workshops',
      description:
        'Calm, supportive workshops for anxiety, depression, and mental wellness—designed to feel safe, not clinical.'
    });
    this.workshopService.getAllWorkshops().subscribe({
      next: data => {
        this.workshops = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
