import { AfterViewInit, Component } from '@angular/core';
declare var Isotope: any;
declare var $: any;
@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {

  private isotope!: any;

  ngAfterViewInit(): void {
    const el = $('.testimonials-carousel');
    const bl = $('.blog-carousel');

  if (el.hasClass('owl-loaded') || bl.hasClass('owl-initialized')) {
    el.trigger('destroy.owl.carousel');
    bl.trigger('destroy.owl.carousel');
  }

    bl.owlCarousel({
    center: true,
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
      992: { items: 3 }
    }
  });
  el.owlCarousel({
    center: true,
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 2 },
      992: { items: 3 }
    }
  });
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