import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  loading = true;
  successMessage = '';
  errorMessage = '';

  profileForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    collegeName: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    cgpa: new FormControl(0, [Validators.required]),
    backlogs: new FormControl(0, [Validators.required]),
    passingYear: new FormControl(0, [Validators.required])
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.api.getProfile().subscribe({
      next: (res: any) => {
        this.profileForm.patchValue({
          name: res.name,
          collegeName: res.collegeName,
          department: res.department,
          cgpa: res.cgpa,
          backlogs: res.backlogs,
          passingYear: res.passingYear
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = 'Unable to load profile';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  submitForm(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.api.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.successMessage = 'Profile saved successfully';
        this.errorMessage = '';
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = 'Unable to save profile';
        this.successMessage = '';
      }
    });
  }
}
