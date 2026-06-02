import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, PageHero],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss'
})
export class Privacy implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Privacy Policy',
      description: 'How Strings of Yoga collects, uses, and protects your personal data.'
    });
  }
}
