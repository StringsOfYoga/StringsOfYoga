import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaFile } from '../../../core/models/media.model';

@Component({
  selector: 'app-media-preview-card',
  imports: [CommonModule],
  templateUrl: './media-preview-card.html',
  styleUrl: './media-preview-card.scss'
})
export class MediaPreviewCard {
  @Input() media!: MediaFile;
  @Input() showActions = true;
  @Input() compact = false;

  onRemove = () => {};
  onRetry = () => {};
}
