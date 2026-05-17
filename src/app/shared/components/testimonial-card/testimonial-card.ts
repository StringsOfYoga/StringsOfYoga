import { Component, Input } from '@angular/core';
import { Testimonial } from '../../../core/models/content.models';

@Component({
  selector: 'app-testimonial-card',
  imports: [],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.scss'
})
export class TestimonialCard {
  @Input({ required: true }) testimonial!: Testimonial;
}
