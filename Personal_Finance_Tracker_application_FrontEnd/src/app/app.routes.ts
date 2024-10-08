import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';

import { usersGuard} from './users.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { CategoriesComponent } from './categories/categories.component';



export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'categories', component: CategoriesComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [usersGuard]},
    {path: 'transactions', component: TransactionsComponent, canActivate: [usersGuard]},
    {path: 'dashboard', component:DashboardComponent, canActivate: [usersGuard]},
    
    {path: '**', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
];
