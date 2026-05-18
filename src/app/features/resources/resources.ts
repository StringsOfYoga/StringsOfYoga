import { AfterViewInit, Component, NgZone, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { PageHero } from '../../shared/components/page-hero/page-hero';
import { MediaCard } from '../../shared/components/media-card/media-card';
import { ContentRepositoryService } from '../../core/services/content-repository.service';
import { SeoService } from '../../core/services/seo.service';
import { ContentCollection, ContentMedia } from '../../core/models/content.models';
import GLightbox from 'glightbox';
import { PdfViewer } from '../../shared/components/pdf-viewer/pdf-viewer';

// Renders the resource library page with search, filters, and media items
@Component({
  selector: 'app-resources',
  imports: [PageHero, MediaCard, PdfViewer, FormsModule],
  templateUrl: './resources.html',
  styleUrl: './resources.scss'
})
export class Resources implements OnInit, AfterViewInit {
  private readonly repo = inject(ContentRepositoryService);
  private readonly seo = inject(SeoService);
  private readonly zone = inject(NgZone);
  private lightbox: ReturnType<typeof GLightbox> | null = null;

  collections: ContentCollection[] = [];
  mediaItems: ContentMedia[] = [];
  searchTerm = '';
  typeFilter = 'all';
  selectedCollectionId = '';
  loading = true;
  loadError = '';

  pdfViewer = {
    isOpen: false,
    url: '',
    title: ''
  };

  readonly typeFilters = [
    { id: 'all', label: 'All' },
    { id: 'audio', label: 'Audio' },
    { id: 'video', label: 'Video' },
    { id: 'pdf', label: 'PDF' },
    { id: 'image', label: 'Images' }
  ];

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Resource Library',
      description:
        'Browse meditation audio, videos, PDF guides, and calming imagery—organized in gentle collections.'
    });
    this.repo.getFeaturedCollections().subscribe({
      next: c => (this.collections = c),
      error: () => (this.collections = [])
    });
    this.loadMedia();
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => this.initLightbox(), 100);
    });
  }

  loadMedia(): void {
    this.loading = true;
    this.loadError = '';
    const source$ = this.selectedCollectionId
      ? this.repo.getMediaByCollection(this.selectedCollectionId)
      : this.repo.searchMedia(this.searchTerm, this.typeFilter);

    source$
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: items => {
          this.mediaItems = items;
          this.zone.runOutsideAngular(() => setTimeout(() => this.initLightbox(), 50));
        },
        error: () => {
          this.mediaItems = [];
          this.loadError = 'Unable to load resources. Please refresh the page.';
        }
      });
  }

  selectCollection(id: string): void {
    this.selectedCollectionId = this.selectedCollectionId === id ? '' : id;
    this.loadMedia();
  }

  onSearch(): void {
    this.loadMedia();
  }

  setTypeFilter(type: string): void {
    this.typeFilter = type;
    this.loadMedia();
  }

  onOpenPdf(media: ContentMedia): void {
    this.pdfViewer = {
      isOpen: true,
      url: media.url,
      title: media.title
    };
  }

  onClosePdf(): void {
    this.pdfViewer.isOpen = false;
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
}
