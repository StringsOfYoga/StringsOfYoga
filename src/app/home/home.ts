import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';
declare var $: any;
import GLightbox from 'glightbox';
@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  activeTab = 'all-genre';
  tabs = ['all-genre', 'business', 'technology', 'romantic', 'adventure', 'fictional'];
  private lightbox: any;
constructor(
  private router: Router,
  private zone: NgZone
) {
  this.router.events.subscribe(() => {
    setTimeout(() => this.initLightbox());
  });
}


  setTab(tab: string) {
    this.activeTab = tab;
  }
  ngAfterViewInit(): void {
    $('.product-grid').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      autoplaySpeed: 2000,
      dots: true,
      arrows: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 999,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 660,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
    $('.main-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: '.prev',
      nextArrow: '.next',
      autoplay: true,
      autoplaySpeed: 4000
    });
    AOS.init({
      duration: 800,
      once: true
    });
    AOS.refreshHard();
   // Run outside Angular to avoid change detection issues
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initLightbox();
        this.initLazyLoad();
      }, 0);
    });
  }

  private initLightbox(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }

    this.lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }

  private initLazyLoad(): void {
    const lazyBackgrounds =
      document.querySelectorAll<HTMLElement>('.lazy-bg');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const bg = el.dataset['bg'];
          if (bg) {
            el.style.backgroundImage = `url('${bg}')`;
            observer.unobserve(el);
          }
        }
      });
    });

    lazyBackgrounds.forEach(bg => observer.observe(bg));
  }

  ngOnDestroy(): void {
    if (this.lightbox) {
      this.lightbox.destroy();
    }
  }
}