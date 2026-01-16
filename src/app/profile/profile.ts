import { AfterViewInit, Component } from '@angular/core';
declare var Isotope: any;
@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements AfterViewInit {

  private isotope!: any;

  ngAfterViewInit(): void {
    const grid = document.querySelector('.portfolio-container');

    if (!grid) return;

    this.isotope = new Isotope(grid, {
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    document.querySelectorAll('#portfolio-filter li').forEach(el => {
      el.addEventListener('click', () => {
        document
          .querySelector('#portfolio-filter .filter-active')
          ?.classList.remove('filter-active');

        el.classList.add('filter-active');

        const filter = el.getAttribute('data-filter');
        this.isotope.arrange({ filter });
      });
    });
  }
}