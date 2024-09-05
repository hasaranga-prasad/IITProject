import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { userGuard } from './user.guard';
import { ViewTransactionComponent } from './view-transaction/view-transaction.component';

export const routes: Routes = [
{path:'login',component:LoginComponent},
{path:'home',component:HomeComponent,canActivate:[userGuard]},
{path:'viewalltransactions',component:ViewTransactionComponent,canActivate:[userGuard]},
{path: '**', component: LoginComponent},
{path: '', redirectTo: '/login', pathMatch: 'full'},
];
