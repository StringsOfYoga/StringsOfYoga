import { Component, Input } from '@angular/core';
import { ContentMedia } from '../../../core/models/content.models';

@Component({
  selector: 'app-media-card',
  imports: [],
  templateUrl: './media-card.html',
  styleUrl: './media-card.scss'
})
export class MediaCard {
  @Input({ required: true }) media!: ContentMedia;

  thumbUrl(): string {
    return this.media.thumbnailUrl || this.media.url || 'download1.jpg';
  }

  isExternalVideo(): boolean {
    return (
      this.media.type === 'video' &&
      (this.media.url.includes('youtube') || this.media.url.includes('youtu.be'))
    );
  }
}
