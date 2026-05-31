import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { WorkshopService } from '../../../core/services/workshop.service';
import { Workshop } from '../../../core/models/workshop.model';
import { CloudinaryUploadService } from '../../../core/services/cloudinary-upload.service';

@Component({
  selector: 'app-admin-workshops',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-workshops.html',
  styleUrl: './admin-workshops.scss'
})
export class AdminWorkshops implements OnInit {
  workshops: Workshop[] = [];
  showForm = false;
  editingId: string | null = null;
  viewMode: 'table' | 'cards' = 'cards';
  minDate = new Date().toISOString().split('T')[0];
  selectedCoverFile: File | null = null;
  coverPreview: string = '';
  submitting = false;

  form = {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    coverImage: '',
    coverImagePublicId: '',
    ctaText: 'Reserve Spot',
    ctaLink: 'https://stringsofyoga.com/workshops',
    featured: false
  };

  private readonly cloudinary = inject(CloudinaryUploadService);

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
      ctaLink: 'https://stringsofyoga.com/workshops',
      featured: false
    };
    this.selectedCoverFile = null;
    this.coverPreview = '';
  }

  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedCoverFile = file;
    this.form.coverImage = '';
    this.form.coverImagePublicId = '';

    const reader = new FileReader();
    reader.onload = e => this.coverPreview = e.target?.result as string;
    reader.readAsDataURL(file);
  }

  onCoverImageRemoved(): void {
    this.form.coverImage = '';
    this.form.coverImagePublicId = '';
    this.selectedCoverFile = null;
    this.coverPreview = '';
  }

  async onSubmit(): Promise<void> {
    if (!this.form.title || !this.form.date || this.submitting) return;

    if (!this.editingId && new Date(this.form.date) < new Date(new Date().toDateString())) {
      return;
    }

    this.submitting = true;

    if (this.selectedCoverFile) {
      try {
        const result = await lastValueFrom(this.cloudinary.uploadFile(this.selectedCoverFile, 'soy/workshops'));
        if (result) {
          this.form.coverImage = result.secure_url;
          this.form.coverImagePublicId = result.public_id;
        }
      } catch {
        this.submitting = false;
        return;
      }
    }

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

    this.submitting = false;
    this.closeForm();
  }

  onDelete(workshop: Workshop): void {
    if (confirm(`Delete "${workshop.title}"?`)) {
      this.workshopService.deleteWorkshop(workshop.id);
    }
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
