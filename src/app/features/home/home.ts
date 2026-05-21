import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as AOS from 'aos';
import GLightbox from 'glightbox';
import { SeoService } from '../../core/services/seo.service';
declare const $: {
  (selector: string): {
    slick: (opts: object) => void;
  };
};

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit, AfterViewInit {
  private readonly zone = inject(NgZone);
  private readonly seo = inject(SeoService);
  private lightbox: ReturnType<typeof GLightbox> | null = null;

  @ViewChild('founderVideo') founderVideoRef!: ElementRef<HTMLVideoElement>;

  activeTab = 'all-genre';
  tabs = ['all-genre', 'business', 'technology', 'romantic', 'adventure', 'fictional'];
  isMuted = true;

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Home',
      description:
        'Strings of Yoga — calm Yog Nidra, breathwork, and restorative wellness. Find your flow, one string at a time.'
    });
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleMute(): void {
    const video = this.founderVideoRef?.nativeElement;
    if (video) {
      video.muted = !video.muted;
      this.isMuted = video.muted;
    }
  }

  ngAfterViewInit(): void {
    $('.product-grid').slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      dots: true,
      arrows: false,
      responsive: [
        { breakpoint: 1400, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 999, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 660, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    });
    $('.main-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: '.prev',
      nextArrow: '.next',
      autoplay: true,
      autoplaySpeed: 5000
    });
    AOS.init({ duration: 600, once: true });
    AOS.refreshHard();
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initLightbox();
        this.initLazyLoad();
        this.playFounderVideo();
      }, 300);
    });
  }

  private playFounderVideo(): void {
    const video = this.founderVideoRef?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => {
        video.muted = true;
        video.play();
      });
    }
  }

  private initLightbox(): void {
    this.lightbox?.destroy();
    this.lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      loop: true,
      autoplayVideos: true
    });
  }

  private initLazyLoad(): void {
    const lazyBackgrounds = document.querySelectorAll<HTMLElement>('.lazy-bg');
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
}
