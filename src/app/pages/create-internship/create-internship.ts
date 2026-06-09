import { Component, inject } from '@angular/core';

import {
ReactiveFormsModule,
FormGroup,
FormControl,
Validators
} from '@angular/forms';

import { Router }
from '@angular/router';

import { ApiService }
from '../../services/api';

@Component({
selector:'app-create-internship',

standalone:true,

imports:[
ReactiveFormsModule
],

templateUrl:'./create-internship.html',

styleUrls:['./create-internship.css']
})

export class CreateInternshipComponent {

private api = inject(ApiService);

private router = inject(Router);

successMessage='';

errorMessage='';


internshipForm = new FormGroup({

title:new FormControl(
'',
[Validators.required]
),

description:new FormControl(
'',
[Validators.required]
),

minimumCGPA:new FormControl(
0,
[
Validators.required,
Validators.min(0)
]
),

maximumBacklogs:new FormControl(
0,
[
Validators.required,
Validators.min(0)
]
),

department:new FormControl(
'',
[Validators.required]
),

allowBacklogs:new FormControl(
false
),

numberOfSeats:new FormControl(
1,
[
Validators.required,
Validators.min(1)
]
),

deadline:new FormControl(
'',
[Validators.required]
),

companyName:new FormControl(
'',
[Validators.required]
)

});


submitForm()
{

console.log("CREATE BUTTON CLICKED");

console.log(this.internshipForm.value);

console.log(this.internshipForm.valid);


if(this.internshipForm.invalid)
{

console.log("FORM INVALID");

this.internshipForm.markAllAsTouched();

return;

}


console.log("API STARTED");


this.api.createInternship(
this.internshipForm.value
)

.subscribe({

next:(res:any)=>
{

console.log("SUCCESS");

console.log(res);

this.successMessage =
'Internship Created Successfully';

this.errorMessage='';


setTimeout(()=>
{
this.router.navigate(
['/admin']
);
},1500);

},


error:(err)=>
{

console.log("ERROR");

console.log(err);

this.errorMessage =
'Failed to create internship';

}

});

}

}