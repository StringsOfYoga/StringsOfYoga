import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { ContentDataService } from '../../core/services/content-data.service';
import { SeoService } from '../../core/services/seo.service';
import { ContactFormPayload, SiteContent } from '../../core/models/content.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-contact',
  imports: [PageHero, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact implements OnInit {
  private readonly content = inject(ContentDataService);
  private readonly seo = inject(SeoService);
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  site?: SiteContent;
  submitted = false;
  error = '';
  loading = false;
  form: ContactFormPayload = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Contact',
      description: 'Reach out to book a session, reserve a workshop spot, or ask a gentle question.'
    });
    this.content.getSiteContent().subscribe(data => (this.site = data));
    this.route.queryParams.subscribe(params => {
      if (params['interest']) {
        this.form.subject = `Session interest: ${params['interest']}`;
      }
      if (params['workshop']) {
        this.form.subject = `Workshop booking: ${params['workshop']}`;
      }
    });
  }

  submit(): void {
    this.loading = true;
    this.error = '';

    const payload = {
      name: this.form.name,
      email: this.form.email,
      message: this.form.message
    };

    this.http.post(`${environment.apiUrl}/contact`, payload).subscribe({
      next: () => {
        this.submitted = true;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to send message. Please try again later.';
        this.loading = false;
      }
    });
  }
}
