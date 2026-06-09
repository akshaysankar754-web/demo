import { Routes } from '@angular/router';

export const routes: Routes = [

{
path:'',
redirectTo:'login',
pathMatch:'full'
},

{
path:'login',
loadComponent:()=>
import('./pages/login/login')
.then(m=>m.LoginComponent)
},

{
path:'register',
loadComponent:()=>
import('./pages/register/register')
.then(m=>m.RegisterComponent)
},

{
path:'verify-email',
loadComponent:() =>
	import('./pages/verify-email/verify-email').then(m => m.VerifyEmailComponent)
},

{
path:'dashboard',
loadComponent:()=>
import('./pages/dashboard/dashboard')
.then(m=>m.DashboardComponent)
},

{
path:'applications',
loadComponent:()=>
import('./pages/my-applications/my-applications')
.then(m=>m.MyApplicationsComponent)
},

{
path:'my-course',
loadComponent:()=>
import('./pages/my-course/my-course')
.then(m=>m.MyCourseComponent)
},

{
path:'admin',
loadComponent:()=>
import('./pages/admin-dashboard/admin-dashboard')
.then(m=>m.AdminDashboardComponent)
},

{
path:'materials',
loadComponent:()=>
import('./pages/materials/materials')
.then(m=>m.MaterialsComponent)
},

{
path:'feedback',
loadComponent:()=>
import('./pages/feedback/feedback')
.then(m=>m.FeedbackComponent)
},

{
path:'create-internship',
loadComponent:()=>
import('./pages/create-internship/create-internship')
.then(m=>m.CreateInternshipComponent)
},

{
path:'profile',
loadComponent:()=>
import('./pages/profile/profile')
.then(m=>m.ProfileComponent)
},

{
path:'**',
redirectTo:'login'
}

];