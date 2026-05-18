import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-viewer.html',
  styleUrl: './pdf-viewer.scss'
})
export class PdfViewer {
  @Input({ required: true }) pdfUrl = '';
  @Input({ required: true }) title = '';
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  private readonly sanitizer = inject(DomSanitizer);

  get safePdfUrl(): SafeResourceUrl | null {
    if (!this.pdfUrl || this.pdfUrl === '#') return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('pdf-viewer__backdrop')) {
      this.onClose();
    }
  }
}
// End of PdfViewer component
