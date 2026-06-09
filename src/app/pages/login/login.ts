import { Component, inject } from '@angular/core';

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
selector:'app-login',

standalone:true,

imports:[
ReactiveFormsModule,
RouterLink
],

templateUrl:'./login.html',

styleUrls:[
  './login.css'
]
})

export class LoginComponent
{
private api = inject(ApiService);

private router = inject(Router);

errorMessage='';

loginForm = new FormGroup({

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
Validators.required
]
)

});

submitForm = () =>
{

if(this.loginForm.invalid)
{
this.loginForm.markAllAsTouched();

return;
}

this.api.login(this.loginForm.value).subscribe({
  next: (res:any) => {
    console.log('LOGIN RESPONSE', res);

    localStorage.setItem('token', res.token);
    localStorage.setItem('role', res.role);

    if (res.cgpa !== undefined) {
      localStorage.setItem('cgpa', res.cgpa.toString());
    } else {
      localStorage.setItem('cgpa', '0');
    }

    if (res.backlogs !== undefined) {
      localStorage.setItem('backlogs', res.backlogs.toString());
    } else {
      localStorage.setItem('backlogs', '0');
    }

    if (res.department !== undefined) {
      localStorage.setItem('department', res.department);
    } else {
      localStorage.setItem('department', '');
    }

    if (res.passingYear !== undefined) {
      localStorage.setItem('passingYear', res.passingYear.toString());
    } else {
      localStorage.setItem('passingYear', '0');
    }

    if (res.hasBacklogs !== undefined) {
      localStorage.setItem('hasBacklogs', res.hasBacklogs.toString());
    }

    localStorage.setItem('name', res.name ?? '');
    this.router.navigate(['/dashboard']);
  },
  error: (err:any) => {
    console.log('LOGIN ERROR', err);
    const serverMessage = err?.error || err?.message;
    this.errorMessage = typeof serverMessage === 'string' && serverMessage.length > 0
      ? serverMessage
      : 'Invalid credentials';
  }
});

}
}