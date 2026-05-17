import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentDataService } from '../../../core/services/content-data.service';
import { SeoService } from '../../../core/services/seo.service';
import { BlogPost } from '../../../core/models/content.models';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.scss'
})
export class BlogPostPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly content = inject(ContentDataService);
  private readonly seo = inject(SeoService);
  post?: BlogPost;

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.content.getBlogPostBySlug(slug).subscribe(post => {
      this.post = post;
      if (post) {
        this.seo.setPage({
          title: post.title,
          description: post.excerpt,
          image: post.image
        });
      }
    });
  }

  paragraphs(): string[] {
    return (this.post?.body ?? '').split('\n\n').filter(Boolean);
  }
}
