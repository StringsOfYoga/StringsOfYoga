import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { ContentDataService } from '../../core/services/content-data.service';
import { SeoService } from '../../core/services/seo.service';
import { ContactFormPayload, SiteContent } from '../../core/models/content.models';

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

  site?: SiteContent;
  submitted = false;
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
    this.submitted = true;
  }
}
