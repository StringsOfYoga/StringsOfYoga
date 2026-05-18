import { Component, OnInit, inject } from '@angular/core';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { ContentDataService } from '../../core/services/content-data.service';
import { SeoService } from '../../core/services/seo.service';
import { SiteContent } from '../../core/models/content.models';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [PageHero, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About implements OnInit {
  private readonly content = inject(ContentDataService);
  private readonly seo = inject(SeoService);
  site?: SiteContent;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'About',
      description:
        'Meet the instructor behind Strings of Yoga—mission, vision, and a gentle philosophy of healing through practice.'
    });
    this.content.getSiteContent().subscribe(data => (this.site = data));
  }
}
