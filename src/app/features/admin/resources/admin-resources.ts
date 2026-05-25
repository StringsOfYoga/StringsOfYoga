import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResourceService } from '../../../core/services/resource.service';
import { Resource } from '../../../core/models/resource.model';
import { MediaUploader } from '../../../shared/components/media-uploader/media-uploader';
import { MediaFile, MediaType } from '../../../core/models/media.model';

@Component({
  selector: 'app-admin-resources',
  imports: [CommonModule, FormsModule, MediaUploader],
  templateUrl: './admin-resources.html',
  styleUrl: './admin-resources.scss'
})
export class AdminResources implements OnInit {
  resources: Resource[] = [];
  showForm = false;
  editingId: string | null = null;
  viewMode: 'grid' | 'list' = 'grid';
  filterType: string = 'all';

  form = {
    title: '',
    description: '',
    type: 'image' as Resource['type'],
    mediaUrl: '',
    thumbnailUrl: '',
    publicId: '',
    tags: '',
    featured: false
  };

  uploadedMedia: MediaFile[] = [];

  constructor(private resourceService: ResourceService) {}

  ngOnInit(): void {
    this.resourceService.resources$.subscribe(resources => {
      this.resources = resources;
    });
  }

  get filteredResources(): Resource[] {
    if (this.filterType === 'all') return this.resources;
    return this.resources.filter(r => r.type === this.filterType);
  }

  get resourceTypes(): { value: string; label: string }[] {
    return [
      { value: 'all', label: 'All' },
      { value: 'image', label: 'Images' },
      { value: 'video', label: 'Videos' },
      { value: 'audio', label: 'Audio' },
      { value: 'pdf', label: 'PDFs' },
      { value: 'youtube', label: 'YouTube' },
      { value: 'vimeo', label: 'Vimeo' }
    ];
  }

  openCreateForm(): void {
    this.resetForm();
    this.showForm = true;
    this.editingId = null;
    this.lockBodyScroll(true);
  }

  openEditForm(resource: Resource): void {
    this.form = {
      title: resource.title,
      description: resource.description,
      type: resource.type,
      mediaUrl: resource.mediaUrl,
      thumbnailUrl: resource.thumbnailUrl || '',
      publicId: resource.publicId || '',
      tags: resource.tags.join(', '),
      featured: resource.featured
    };
    this.editingId = resource.id;
    this.showForm = true;
    this.lockBodyScroll(true);
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.resetForm();
    this.lockBodyScroll(false);
  }

  resetForm(): void {
    this.form = {
      title: '',
      description: '',
      type: 'image',
      mediaUrl: '',
      thumbnailUrl: '',
      publicId: '',
      tags: '',
      featured: false
    };
    this.uploadedMedia = [];
  }

  onSubmit(): void {
    if (!this.form.title) return;

    const tags = this.form.tags
      .split(',')
      .map(t => t.trim())
      .filter(t => t);

    const resourceData = {
      title: this.form.title,
      description: this.form.description,
      type: this.form.type,
      mediaUrl: this.form.mediaUrl,
      thumbnailUrl: this.form.thumbnailUrl || undefined,
      publicId: this.form.publicId || undefined,
      tags,
      featured: this.form.featured
    };

    if (this.editingId) {
      this.resourceService.updateResource(this.editingId, resourceData);
    } else {
      this.resourceService.addResource(resourceData);
    }

    this.closeForm();
  }

  onDelete(resource: Resource): void {
    if (confirm(`Delete "${resource.title}"?`)) {
      this.resourceService.deleteResource(resource.id);
    }
  }

  onMediaUploaded(files: MediaFile[]): void {
    this.uploadedMedia = [...this.uploadedMedia, ...files];

    if (files.length > 0) {
      const file = files[0];
      this.form.mediaUrl = file.cloudinaryUrl || file.url || '';
      this.form.publicId = file.publicId || '';
      this.form.thumbnailUrl = file.thumbnail || file.preview || '';

      if (file.type === 'youtube') {
        this.form.type = 'youtube';
      } else if (file.type === 'vimeo') {
        this.form.type = 'vimeo';
      } else if (file.type === 'video') {
        this.form.type = 'video';
      } else if (file.type === 'audio') {
        this.form.type = 'audio';
      } else if (file.type === 'pdf') {
        this.form.type = 'pdf';
      } else if (file.type === 'image') {
        this.form.type = 'image';
      }
    }
  }

  onMediaRemoved(id: string): void {
    this.uploadedMedia = this.uploadedMedia.filter(f => f.id !== id);
    if (this.uploadedMedia.length === 0) {
      this.form.mediaUrl = '';
      this.form.publicId = '';
      this.form.thumbnailUrl = '';
    }
  }

  toggleFeatured(resource: Resource): void {
    this.resourceService.toggleFeatured(resource.id);
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      'image': 'image',
      'video': 'play',
      'audio': 'music',
      'pdf': 'file',
      'document': 'file-text',
      'youtube': 'youtube',
      'vimeo': 'video',
      'external': 'link'
    };
    return icons[type] || 'file';
  }

  getTypeLabel(type: string): string {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  lockBodyScroll(lock: boolean): void {
    if (lock) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }
}
