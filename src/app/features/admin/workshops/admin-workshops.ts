import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkshopService } from '../../../core/services/workshop.service';
import { Workshop } from '../../../core/models/workshop.model';
import { MediaUploader } from '../../../shared/components/media-uploader/media-uploader';
import { MediaFile } from '../../../core/models/media.model';

@Component({
  selector: 'app-admin-workshops',
  imports: [CommonModule, FormsModule, MediaUploader],
  templateUrl: './admin-workshops.html',
  styleUrl: './admin-workshops.scss'
})
export class AdminWorkshops implements OnInit {
  workshops: Workshop[] = [];
  showForm = false;
  editingId: string | null = null;
  viewMode: 'table' | 'cards' = 'cards';

  form = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    coverImage: '',
    coverImagePublicId: '',
    ctaText: 'Reserve Spot',
    ctaLink: '/workshops',
    featured: false
  };

  constructor(private workshopService: WorkshopService) {}

  ngOnInit(): void {
    this.workshopService.workshops$.subscribe(workshops => {
      this.workshops = workshops;
    });
  }

  openCreateForm(): void {
    this.resetForm();
    this.showForm = true;
    this.editingId = null;
    this.lockBodyScroll(true);
  }

  openEditForm(workshop: Workshop): void {
    this.form = {
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      time: workshop.time,
      location: workshop.location,
      coverImage: workshop.coverImage,
      coverImagePublicId: (workshop as any).coverImagePublicId || '',
      ctaText: workshop.ctaText,
      ctaLink: workshop.ctaLink,
      featured: workshop.featured
    };
    this.editingId = workshop.id;
    this.showForm = true;
    this.lockBodyScroll(true);
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
    this.resetForm();
    this.lockBodyScroll(false);
  }

  lockBodyScroll(lock: boolean): void {
    if (lock) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }

  resetForm(): void {
    this.form = {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      coverImage: '',
      coverImagePublicId: '',
      ctaText: 'Reserve Spot',
      ctaLink: '/workshops',
      featured: false
    };
  }

  onSubmit(): void {
    if (!this.form.title || !this.form.date) return;

    const workshopData: any = {
      title: this.form.title,
      description: this.form.description,
      date: this.form.date,
      time: this.form.time,
      location: this.form.location,
      coverImage: this.form.coverImage,
      ctaText: this.form.ctaText,
      ctaLink: this.form.ctaLink,
      featured: this.form.featured
    };

    if (this.form.coverImagePublicId) {
      workshopData.coverImagePublicId = this.form.coverImagePublicId;
    }

    if (this.editingId) {
      this.workshopService.updateWorkshop(this.editingId, workshopData);
    } else {
      this.workshopService.addWorkshop(workshopData);
    }

    this.closeForm();
  }

  onDelete(workshop: Workshop): void {
    if (confirm(`Delete "${workshop.title}"?`)) {
      this.workshopService.deleteWorkshop(workshop.id);
    }
  }

  onCoverImageUploaded(files: MediaFile[]): void {
    if (files.length > 0) {
      const file = files[0];
      this.form.coverImage = file.cloudinaryUrl || file.preview || '';
      this.form.coverImagePublicId = file.publicId || '';
    }
  }

  onCoverImageRemoved(): void {
    this.form.coverImage = '';
    this.form.coverImagePublicId = '';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  toggleFeatured(workshop: Workshop): void {
    this.workshopService.updateWorkshop(workshop.id, { featured: !workshop.featured });
  }
}
