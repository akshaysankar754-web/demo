import {
Component,
OnInit,
inject,
ChangeDetectorRef
} from '@angular/core';

import {
CommonModule
} from '@angular/common';

import { RouterLink } from '@angular/router';

import { ApiService } from '../../services/api';
import { SidebarComponent } from '../../components/sidebar/sidebar';

@Component({

selector:'app-admin-dashboard',

standalone:true,

imports:[
CommonModule,
RouterLink,
SidebarComponent
],

templateUrl:'./admin-dashboard.html',

styleUrls:[
'./admin-dashboard.css'
]

})

export class AdminDashboardComponent
implements OnInit
{

private api = inject(ApiService);

private cdr = inject(ChangeDetectorRef);

internships:any[] = [];

selectedApplications:any[] = [];

showApplicants = false;

feedbackOpen = true;

stats = {
  totalStudents: 0,
  totalInternships: 0,
  totalApplications: 0,
  acceptedApplications: 0
};

statsKeys: Array<keyof typeof this.stats> = [
  'totalStudents',
  'totalInternships',
  'totalApplications',
  'acceptedApplications'
];

selectedInternshipId = 0;


ngOnInit(): void
{
this.loadInternships();
this.loadFeedbackStatus();
this.loadStats();
}


loadInternships = () =>
{

this.api
.getAdminInternships()

.subscribe({

next:(res:any)=>
{

this.internships = [...res];

this.cdr.detectChanges();

},

error:(err)=>
{

console.log(err);

}

});

}

loadStats = () =>
{
    this.api.getAdminStats().subscribe({
      next:(res:any)=>
      {
        this.stats = {
          totalStudents: res.totalStudents ?? 0,
          totalInternships: res.totalInternships ?? 0,
          totalApplications: res.totalApplications ?? 0,
          acceptedApplications: res.acceptedApplications ?? 0
        };
        this.cdr.detectChanges();
      },
      error:(err)=>
      {
        console.log(err);
      }
    });
}


toggleFeedback = () =>
{
this.api.setFeedbackStatus(!this.feedbackOpen).subscribe({
next:() => {
this.feedbackOpen = !this.feedbackOpen;
},
error:(err) => console.log(err)
});
}

loadFeedbackStatus = () =>
{
this.api.getFeedbackStatus().subscribe({
next:(res:any) => {
this.feedbackOpen = res?.isFeedbackOpen ?? true;
},
error:(err) => console.log(err)
});
}

acceptApplicant = (applicationId: number) =>
{
this.api.updateApplicationStatus(applicationId, 'Accepted').subscribe({
next: () => this.viewApplicants(this.selectedInternshipId),
error:(err:any) => console.log(err)
});
}

rejectApplicant = (applicationId: number) =>
{
this.api.updateApplicationStatus(applicationId, 'Rejected').subscribe({
next: () => this.viewApplicants(this.selectedInternshipId),
error:(err:any) => console.log(err)
});
}

viewApplicants = (
internshipId:number
) =>
{
this.selectedInternshipId = internshipId;

this.showApplicants = true;

this.api
.getApplicationsForInternship(
internshipId
)

.subscribe({

next:(res:any)=>
{

this.selectedApplications = [...res];

this.cdr.detectChanges();

},

error:(err)=>
{

console.log(err);

}

});

}

}