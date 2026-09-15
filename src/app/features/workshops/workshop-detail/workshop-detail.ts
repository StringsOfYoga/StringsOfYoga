import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WorkshopService } from '../../../core/services/workshop.service';
import { Workshop } from '../../../core/models/workshop.model';
import { SeoService } from '../../../core/services/seo.service';
@Component({
  selector: 'app-workshop-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './workshop-detail.html',
  styleUrl: './workshop-detail.scss'
})
export class WorkshopDetail implements OnInit {
  workshop: Workshop | null = null;
  loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly workshopService: WorkshopService,
    private readonly seo: SeoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.workshopService.getWorkshopById(id).subscribe({
        next: w => {
          this.workshop = w;
          this.loading = false;
          this.seo.setPage({
            title: w.title,
            description: w.description
          });
        },
        error: () => this.loading = false
      });
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }
}
