import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.css']
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);

  email = '';
  action = 'register';

  successMessage = '';
  errorMessage = '';

  form = new FormGroup({
    otp: new FormControl('', [Validators.required])
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email') ?? '';
      this.action = params.get('action') ?? 'register';
      const warn = params.get('warn');
      if (warn) {
        this.errorMessage = warn;
      }
      if (!this.email) {
        this.router.navigate(['/register']);
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = { email: this.email, otpCode: this.form.get('otp')?.value };
    const request = this.action === 'login'
      ? this.api.verifyLogin(payload)
      : this.api.verifyEmail(payload);

    request.subscribe({
      next: (res: any) => {
        if (this.action === 'login') {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          this.successMessage = 'Login verified. Redirecting...';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/dashboard']), 1200);
          return;
        }

        this.successMessage = res?.message || 'Email verified successfully. Redirecting to login...';
        this.errorMessage = '';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      error: (err: any) => {
        this.errorMessage = err?.error || 'Invalid verification code.';
        this.successMessage = '';
      }
    });
  }
}
