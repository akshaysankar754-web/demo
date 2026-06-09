import { Component, inject, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  internships: any[] = [];
  loading = true;
  errorMessage = '';
  studentCgpa = 0;
  studentBacklogs = 0;

  ngOnInit(): void {
    this.studentCgpa = Number(localStorage.getItem('cgpa')) || 0;
    this.studentBacklogs = Number(localStorage.getItem('backlogs')) || 0;
    this.loadInternships();
  }

  loadInternships = () => {
    this.loading = true;
    this.errorMessage = '';

    this.api.getInternships().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : [];

        this.internships = data.map((internship: any) => ({
          ...internship,
          isEligible:
            this.studentCgpa >= Number(internship.minimumCGPA ?? internship.MinimumCGPA ?? 0) &&
            (Number(internship.maximumBacklogs ?? internship.MaximumBacklogs ?? 0) === 0 ||
              this.studentBacklogs <= Number(internship.maximumBacklogs ?? internship.MaximumBacklogs ?? 0))
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.internships = [];
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Unable to load internships';
        this.cdr.detectChanges();
      }
    });
  };

  applyInternship = (internshipId: number) => {
    this.api.applyInternship(internshipId).subscribe({
      next: () => {
        alert('Applied Successfully');
        this.loadInternships();
      },
      error: (err: any) => {
        console.log(err);
        alert('Already Applied or Error');
      }
    });
  };
}
