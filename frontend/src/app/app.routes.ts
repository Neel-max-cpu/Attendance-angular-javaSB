import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ForgotComponent } from './pages/forgot/forgot.component';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch:"full"},
    {path: "login", component:LoginComponent},
    {path: "signup", component:SignupComponent},
    {path: "profile", component:ProfileComponent},
    {path: "dashboard", component:DashboardComponent},
    {path: "forgot", component:ForgotComponent}
];
