import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Workshop } from '../../../core/models/content.models';

@Component({
  selector: 'app-workshop-card',
  imports: [DatePipe, RouterLink],
  templateUrl: './workshop-card.html',
  styleUrl: './workshop-card.scss'
})
export class WorkshopCard {
  @Input({ required: true }) workshop!: Workshop;
}
