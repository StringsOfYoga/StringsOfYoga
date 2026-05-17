import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentDataService } from '../../../core/services/content-data.service';
import { SiteBrand } from '../../../core/models/content.models';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer implements OnInit {
  private readonly content = inject(ContentDataService);
  brand?: SiteBrand;
  readonly year = new Date().getFullYear();

  ngOnInit(): void {
    this.content.getSiteContent().subscribe(site => (this.brand = site.brand));
  }
}
