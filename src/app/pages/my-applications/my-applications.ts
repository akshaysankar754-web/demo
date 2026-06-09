import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './my-applications.html',
  styleUrls: ['./my-applications.css']
})
export class MyApplicationsComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  applications: any[] = [];
  loading = true;
  isAdmin = localStorage.getItem('role') === 'Admin';

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications() {
    this.loading = true;
    if (this.isAdmin) {
      this.api.getAllApplications().subscribe({
        next: (res: any) => {
          this.applications = Array.isArray(res) ? res : [];
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.log(err);
          this.applications = [];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
      return;
    }

    this.api.getMyApplications().subscribe({
      next: (res: any) => {
        this.applications = Array.isArray(res) ? res : [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.applications = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateStatus(applicationId: number, status: string) {
    this.api.updateApplicationStatus(applicationId, status).subscribe({
      next: () => {
        this.loadApplications();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
