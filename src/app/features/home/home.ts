import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import GLightbox from 'glightbox';
import { SeoService } from '../../core/services/seo.service';
import { WorkshopService } from '../../core/services/workshop.service';
import { Workshop } from '../../core/models/workshop.model';
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
  private readonly workshopService = inject(WorkshopService);
  private lightbox: ReturnType<typeof GLightbox> | null = null;

  @ViewChild('founderVideo') founderVideoRef!: ElementRef<HTMLVideoElement>;

  activeTab = 'all-genre';
  tabs = ['all-genre', 'business', 'technology', 'romantic', 'adventure', 'fictional'];
  isMuted = true;
  upcomingWorkshops: Workshop[] = [];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Home',
      description:
        'Strings of Yoga — calm Yog Nidra, breathwork, and restorative wellness. Find your flow, one string at a time.'
    });

    this.workshopService.workshops$.subscribe(workshops => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = workshops
        .filter(w => w.featured && w.date) 
        .filter(w => {
          if (!w.date) return false;
          const workshopDate = new Date(w.date);
          return workshopDate >= today;
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

      this.upcomingWorkshops = upcoming;
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

  formatDate(dateStr: string): { month: string; day: string } {
    if (!dateStr) return { month: '', day: '' };
    const date = new Date(dateStr);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate().toString().padStart(2, '0');
    return { month, day };
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
