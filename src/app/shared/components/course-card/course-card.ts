import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../../core/models/content.models';

@Component({
  selector: 'app-course-card',
  imports: [RouterLink],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss'
})
export class CourseCard {
  @Input({ required: true }) course!: Course;
}
