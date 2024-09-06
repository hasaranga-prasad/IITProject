import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../users.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  formData: any = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage: string = '';

  constructor(
    private readonly userService: UsersService,
    private readonly router: Router,
    private toastr: ToastrService
  ) { }

  async handleSubmit() {
   
    if (!this.formData.username || !this.formData.email || !this.formData.password || !this.formData.confirmPassword) {
      this.toastr.error('Please fill in all fields.');
      return;
    }

    
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.formData.email)) {
      this.toastr.error('Invalid email format.');
      return;
    }

    
    if (this.formData.username.length < 3) {
      this.toastr.error('Username must be at least 3 characters long.');
      return;
    }

    
    if (this.formData.password !== this.formData.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    }

  
    const confirmRegistration = confirm('Are you sure you want to register this user?');
    if (!confirmRegistration) {
      return;
    }

    try {
      const response = await this.userService.register(this.formData);
      if (response.statusCode === 200) {
        
        this.formData = {
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        };

       
        this.router.navigate(['/login']).then(() => {
          this.toastr.success('Registration successful! Please log in.');
        }).catch(error => {
          console.error('Navigation error:', error);
        });
      } else {
        this.toastr.success('Registration successful! Please log in.');
      }
    } catch (error: any) {
      this.toastr.error(error.message || 'An error occurred during registration.');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']).then(() => {
      console.log('Navigation to login successful');
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }
}
