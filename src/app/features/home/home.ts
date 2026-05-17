import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import * as AOS from 'aos';
declare var $: any;
import GLightbox from 'glightbox';
import { AuthService } from '../../core/services/auth.service';
import { CollectionService } from '../../core/services/collection.service';
import { MediaService } from '../../core/services/media.service';
import {
  CollectionRequest,
  MediaRequest,
  GalleryCollection,
  GalleryMedia
} from '../../core/models/api.models';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  activeTab = 'all-genre';
  tabs = ['all-genre', 'business', 'technology', 'romantic', 'adventure', 'fictional'];
  private lightbox: any;
  authToken = '';
  authMessage = '';
  apiMessage = '';
  isBusy = false;

  loginForm = { email: '', password: '' };
  registerForm = { name: '', email: '', password: '' };
  collectionForm: CollectionRequest = { name: '', description: '', isFeatured: false };
  mediaForm: MediaRequest = {
    title: '',
    type: 'audio',
    url: '',
    thumbnailUrl: '',
    collectionId: '',
    description: '',
    isFeatured: false
  };
  searchTerm = '';
  deleteMediaId = '';
  uploadRequest = { fileName: '', fileType: '' };
  uploadSignatureResponse = '';

  collections: GalleryCollection[] = [];
  featuredCollections: GalleryCollection[] = [];
  mediaItems: GalleryMedia[] = [];

  constructor(
    private router: Router,
    private zone: NgZone,
    private readonly authService: AuthService,
    private readonly collectionService: CollectionService,
    private readonly mediaService: MediaService
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
      duration: 400,
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
    this.refreshGalleryData();
  }

  register(): void {
    this.isBusy = true;
    this.authMessage = '';
    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.isBusy = false;
        this.authMessage = 'Registration successful. Please login.';
      },
      error: err => {
        this.isBusy = false;
        this.authMessage = this.extractError(err, 'Registration failed');
      }
    });
  }

  login(): void {
    this.isBusy = true;
    this.authMessage = '';
    this.authService.login(this.loginForm).subscribe({
      next: res => {
        this.isBusy = false;
        this.authToken = res?.token ?? res?.accessToken ?? '';
        this.authMessage = this.authToken
          ? 'Login successful. Token saved in session.'
          : 'Login successful.';
      },
      error: err => {
        this.isBusy = false;
        this.authMessage = this.extractError(err, 'Login failed');
      }
    });
  }

  createCollection(): void {
    this.isBusy = true;
    this.collectionService.createCollection(this.collectionForm).subscribe({
      next: () => {
        this.isBusy = false;
        this.apiMessage = 'Collection created successfully.';
        this.collectionForm = { name: '', description: '', isFeatured: false };
        this.refreshGalleryData();
      },
      error: err => {
        this.isBusy = false;
        this.apiMessage = this.extractError(err, 'Unable to create collection');
      }
    });
  }

  createMedia(): void {
    this.isBusy = true;
    this.mediaService.createMedia(this.mediaForm).subscribe({
      next: () => {
        this.isBusy = false;
        this.apiMessage = 'Media created successfully.';
        this.mediaForm = {
          title: '',
          type: 'audio',
          url: '',
          thumbnailUrl: '',
          collectionId: '',
          description: '',
          isFeatured: false
        };
        this.refreshGalleryData();
      },
      error: err => {
        this.isBusy = false;
        this.apiMessage = this.extractError(err, 'Unable to create media');
      }
    });
  }

  deleteMedia(): void {
    if (!this.deleteMediaId.trim()) {
      this.apiMessage = 'Enter media id to delete.';
      return;
    }

    this.isBusy = true;
    this.mediaService.deleteMedia(this.deleteMediaId.trim()).subscribe({
      next: () => {
        this.isBusy = false;
        this.apiMessage = 'Media deleted successfully.';
        this.deleteMediaId = '';
        this.refreshGalleryData();
      },
      error: err => {
        this.isBusy = false;
        this.apiMessage = this.extractError(err, 'Unable to delete media');
      }
    });
  }

  searchMedia(): void {
    this.isBusy = true;
    this.mediaService.searchMedia(this.searchTerm).subscribe({
      next: res => {
        this.isBusy = false;
        this.mediaItems = this.normalizeList<GalleryMedia>(res);
        this.zone.runOutsideAngular(() => setTimeout(() => this.initLightbox(), 0));
      },
      error: err => {
        this.isBusy = false;
        this.apiMessage = this.extractError(err, 'Search failed');
      }
    });
  }

  loadMediaByCollection(collectionId?: string): void {
    if (!collectionId) {
      return;
    }
    this.isBusy = true;
    this.mediaService.getMediaByCollection(collectionId).subscribe({
      next: res => {
        this.isBusy = false;
        this.mediaItems = this.normalizeList<GalleryMedia>(res);
        this.zone.runOutsideAngular(() => setTimeout(() => this.initLightbox(), 0));
      },
      error: err => {
        this.isBusy = false;
        this.apiMessage = this.extractError(err, 'Failed to load media by collection');
      }
    });
  }

  refreshGalleryData(): void {
    this.collectionService.getCollections().subscribe({
      next: res => (this.collections = this.normalizeList<GalleryCollection>(res)),
      error: () => (this.collections = [])
    });

    this.collectionService.getFeaturedCollections().subscribe({
      next: res => (this.featuredCollections = this.normalizeList<GalleryCollection>(res)),
      error: () => (this.featuredCollections = [])
    });

    this.mediaService.getFeaturedMedia().subscribe({
      next: res => {
        this.mediaItems = this.normalizeList<GalleryMedia>(res);
        this.zone.runOutsideAngular(() => setTimeout(() => this.initLightbox(), 0));
      },
      error: () => (this.mediaItems = [])
    });
  }

  getUploadSignature(): void {
    if (!this.uploadRequest.fileName || !this.uploadRequest.fileType) {
      this.apiMessage = 'File name and file type are required for upload signature.';
      return;
    }

    this.isBusy = true;
    this.mediaService.getUploadSignature(this.uploadRequest).subscribe({
      next: res => {
        this.isBusy = false;
        this.uploadSignatureResponse = JSON.stringify(res);
        this.apiMessage = 'Upload signature generated.';
      },
      error: err => {
        this.isBusy = false;
        this.apiMessage = this.extractError(err, 'Failed to generate upload signature');
      }
    });
  }

  private normalizeList<T>(res: any): T[] {
    if (Array.isArray(res)) {
      return res;
    }
    if (Array.isArray(res?.data)) {
      return res.data;
    }
    if (Array.isArray(res?.items)) {
      return res.items;
    }
    return [];
  }

  private extractError(err: any, fallback: string): string {
    return err?.error?.message ?? err?.message ?? fallback;
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