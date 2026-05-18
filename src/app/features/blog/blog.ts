import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { ContentDataService } from '../../core/services/content-data.service';
import { SeoService } from '../../core/services/seo.service';
import { BlogPost } from '../../core/models/content.models';

@Component({
  selector: 'app-blog',
  imports: [PageHero, RouterLink, DatePipe],
  templateUrl: './blog.html',
  styleUrl: './blog.scss'
})
export class Blog implements OnInit {
  private readonly content = inject(ContentDataService);
  private readonly seo = inject(SeoService);
  posts: BlogPost[] = [];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Blog',
      description:
        'Articles on Yog Nidra, breathwork, anxiety healing, meditation, and gentle self-care.'
    });
    this.content.getBlogPosts().subscribe(data => (this.posts = data));
  }
}
