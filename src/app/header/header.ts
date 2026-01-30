import { AfterViewInit, Component } from '@angular/core';

declare const jQuery: any;
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements AfterViewInit {

ngAfterViewInit() {
  jQuery('.stellarnav').stellarNav({
    theme: 'plain',
    closingDelay: 250,
  });
}
}
