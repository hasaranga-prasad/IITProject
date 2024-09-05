import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

import { usersGuard} from './users.guard';



export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent, canActivate: [usersGuard]},
    {path: 'profile', component: ProfileComponent, canActivate: [usersGuard]},
  
    {path: '**', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
];
