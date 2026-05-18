import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-page-hero',
  imports: [],
  templateUrl: './page-hero.html',
  styleUrl: './page-hero.scss'
})
export class PageHero {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() eyebrow = '';
}
