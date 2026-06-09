import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
ReactiveFormsModule,
FormGroup,
FormControl,
Validators
} from '@angular/forms';

import {
Router,
RouterLink
} from '@angular/router';

import { ApiService }
from '../../services/api';

@Component({
selector:'app-register',

standalone:true,

imports:[
  ReactiveFormsModule,
  RouterLink,
  CommonModule
],

templateUrl:'./register.html',

styleUrls:[
  './register.css'
]
})

export class RegisterComponent {

private api = inject(ApiService);

private router = inject(Router);

private cdr = inject(ChangeDetectorRef);

successMessage='';

errorMessage='';

loading = false;


registerForm = new FormGroup({

name:new FormControl(
'',
[Validators.required]
),

email:new FormControl(
'',
[
Validators.required,
Validators.email
]
),

password:new FormControl(
'',
[
Validators.required,
Validators.minLength(6)
]
),

cgpa:new FormControl(
0,
[Validators.required]
),

    backlogs:new FormControl(
        0,
        [Validators.required]
    ),

    department:new FormControl(
        '',
        [Validators.required]
    ),

    passingYear:new FormControl(
        0,
        [Validators.required]
    ),

    collegeName:new FormControl(
        '',
        [Validators.required]
    )

});

// After successful registration we'll navigate to a verification page
verificationPending = false;


submitForm()
{

console.log("BUTTON CLICKED");

console.log(this.registerForm.value);

console.log(this.registerForm.valid);

if(this.registerForm.invalid)
{
console.log("FORM INVALID");

this.registerForm.markAllAsTouched();

return;
}

this.loading = true;
console.log("API CALL STARTED");

this.api.register(
this.registerForm.value
)

.subscribe({

next:(res:any)=>
{

  console.log("SUCCESS");
  console.log(res);

  this.successMessage = res?.message ?? 'Registration successful. Verification code sent to your email.';
  this.errorMessage = '';

  // On success navigate to verification page with the registered email
  const email = this.registerForm.get('email')?.value ?? '';
  this.loading = false;
  this.router.navigate(['/verify-email'], { queryParams: { email } });
  this.cdr.detectChanges();

},

error:(err)=>
{

console.log("ERROR");

console.log(err);
this.loading = false;

// Handle specific backend errors
if (err && err.status === 500 && typeof err.error === 'string' && err.error.includes('Unable to send verification email')) {
  const email = this.registerForm.get('email')?.value ?? '';
  this.router.navigate(['/verify-email'], { queryParams: { email, warn: 'Unable to send verification email' } });
  this.cdr.detectChanges();
  return;
}

if (err && err.status === 400) {
  // Common 400 responses: existing email or validation messages from server
  let msg = 'Invalid request';
  try {
    if (typeof err.error === 'string') {
      msg = err.error;
    } else if (err.error?.message) {
      msg = err.error.message;
    } else if (err.error?.error && typeof err.error.error === 'string') {
      msg = err.error.error;
    } else if (err.error?.detail && typeof err.error.detail === 'string') {
      msg = err.error.detail;
    } else if (err.error?.title) {
      msg = err.error.title;
    } else if (err.error?.errors) {
      // ModelState style errors: collect messages
      const errors = err.error.errors;
      const parts: string[] = [];
      Object.keys(errors).forEach(k => {
        const val = errors[k];
        if (Array.isArray(val)) parts.push(...val);
        else if (typeof val === 'string') parts.push(val);
      });
      if (parts.length) msg = parts.join('; ');
    } else {
      msg = JSON.stringify(err.error);
    }
  } catch (e) {
    msg = 'Invalid request';
  }

  this.errorMessage = msg;
  this.successMessage = '';
  this.cdr.detectChanges();
  return;
}

this.errorMessage = err.error || 'Unable to register. Please try again.';
this.successMessage = '';
this.cdr.detectChanges();

}

});

}

// OTP verification handled on the dedicated verify-email page.

}