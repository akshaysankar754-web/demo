import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class FeedbackComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  isAdmin = localStorage.getItem('role') === 'Admin';
  feedbackOpen = false;
  loading = true;
  successMessage = '';
  errorMessage = '';
  submittedSuccessfully = false;

  questions = [
    { text: 'How would you rate the overall course quality?' },
    { text: 'How would you rate the course content and materials?' },
    { text: 'How was the instructor\'s delivery and teaching style?' },
    { text: 'Did the course meet your expectations?' },
    { text: 'How would you rate the user interface and platform experience?' }
  ];

  answers: string[] = ['', '', '', '', ''];
  feedbacks: any[] = [];

  ngOnInit(): void {
    this.loadFeedbackStatus();
    if (this.isAdmin) {
      this.loadFeedbacks();
    }
  }

  loadFeedbackStatus(): void {
    this.api.getFeedbackStatus().subscribe({
      next: (res: any) => {
        this.feedbackOpen = res?.isFeedbackOpen ?? false;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFeedbacks(): void {
    this.api.getFeedbacks().subscribe({
      next: (res: any) => {
        this.feedbacks = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  toggleFeedback(): void {
    this.api.setFeedbackStatus(!this.feedbackOpen).subscribe({
      next: () => {
        this.feedbackOpen = !this.feedbackOpen;
        if (this.isAdmin) {
          this.loadFeedbacks();
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  isFormValid(): boolean {
    return this.answers.every(ans => ans !== '');
  }

  submitFeedback(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please answer all 5 questions.';
      this.successMessage = '';
      return;
    }

    this.api.submitFeedback({
      answers: this.answers
    }).subscribe({
      next: () => {
        this.successMessage = 'Feedback submitted successfully!';
        this.errorMessage = '';
        this.submittedSuccessfully = true;
        this.answers = ['', '', '', '', ''];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage = 'Unable to submit feedback';
        this.successMessage = '';
        this.cdr.detectChanges();
      }
    });
  }
}
