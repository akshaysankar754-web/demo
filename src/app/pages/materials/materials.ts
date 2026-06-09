import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './materials.html',
  styleUrls: ['./materials.css']
})
export class MaterialsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  isAdmin = localStorage.getItem('role') === 'Admin';
  materials: any[] = [];
  internships: any[] = [];
  loading = true;
  successMessage = '';
  errorMessage = '';

  title = '';
  description = '';
  fileUrl = '';
  selectedInternshipId: number | null = null;

  getFormattedUrl(url: string): string {
    if (!url) return '#';
    const targetUrl = url.trim();
    if (/^https?:\/\//i.test(targetUrl)) {
      return targetUrl;
    }
    return 'https://' + targetUrl;
  }

  ngOnInit(): void {
    this.loadMaterials();
    if (this.isAdmin) {
      this.loadInternships();
    }
  }

  loadMaterials(): void {
    this.api.getStudyMaterials().subscribe({
      next: (res: any) => {
        this.materials = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = 'Unable to load materials';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadInternships(): void {
    this.api.getInternships().subscribe({
      next: (res: any) => {
        this.internships = Array.isArray(res) ? res : [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  uploadMaterial(): void {
    if (!this.title || !this.description || !this.fileUrl || !this.selectedInternshipId) {
      this.errorMessage = 'Please fill all fields and select an internship.';
      this.successMessage = '';
      return;
    }

    this.api.createStudyMaterial({
      title: this.title,
      description: this.description,
      fileUrl: this.fileUrl,
      internshipId: this.selectedInternshipId
    }).subscribe({
      next: () => {
        this.successMessage = 'Material uploaded successfully';
        this.errorMessage = '';
        this.title = '';
        this.description = '';
        this.fileUrl = '';
        this.selectedInternshipId = null;
        this.loadMaterials();
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = 'Unable to upload material';
        this.successMessage = '';
      }
    });
  }
}
