import { AfterViewInit, Component } from '@angular/core';
declare var Isotope: any;
@Component({
  selector: 'app-class',
  imports: [],
  templateUrl: './class.html',
  styleUrl: './class.scss',
})
export class Class implements AfterViewInit {
    private isotope!: any;
  ngAfterViewInit(): void {
    const container = document.querySelector('.class-container');

    if (!container) return;

    this.isotope = new Isotope(container, {
      itemSelector: '.class-item',
      layoutMode: 'fitRows'
    });

    document.querySelectorAll('#class-filter li').forEach(el => {
      el.addEventListener('click', () => {
        document
          .querySelector('#class-filter .filter-active')
          ?.classList.remove('filter-active');

        el.classList.add('filter-active');

        const filterValue = el.getAttribute('data-filter');
        this.isotope.arrange({ filter: filterValue });
      });
    });
  }
}
