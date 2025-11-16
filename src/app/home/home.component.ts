import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('900ms ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})

export class HomeComponent {

}
