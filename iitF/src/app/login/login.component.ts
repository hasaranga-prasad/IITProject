import { Component, OnInit } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { CommonModule } from '@angular/common'; 
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { UserService } from '../user.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ROLE, TOKEN } from '../c/comon';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ProgressSpinnerModule,FormsModule,CommonModule,CheckboxModule,ToastModule, InputIconModule, IconFieldModule,ButtonModule, InputTextModule, HttpClientModule, FloatLabelModule,RippleModule,CardModule,DividerModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent  {
  username: string = '';
  password: string = '';
  loading: boolean = false; // Add loading state

  constructor(
    private  userService: UserService,
    private router: Router,
    private messageService: MessageService
  ) { }
 

  async handleSubmit() {
    if (!this.username || !this.password) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Input Error',
        detail: 'Username and password are required.'
      });
      return;
    }

    this.loading = true; // Start loading
    try {
      const response = await this.userService.login(this.username, this.password);

      if (response.statusCode === 200) {
        console.log(response);
        
        localStorage.setItem(TOKEN, response.token);
        localStorage.setItem(ROLE, response.role);
        
        this.router.navigate(['/home']);
        this.messageService.add({
          severity: 'success',
          summary: 'Login Successful',
          detail: response.message
        });
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: response.message
        });
      }
    } catch (error: any) {
      this.messageService.add({
        severity: 'error',
        summary: 'Login Error',
        detail: 'An unexpected error occurred. Please try again later.'
      });
    } finally {
      this.loading = false; 
    }
  }
}
