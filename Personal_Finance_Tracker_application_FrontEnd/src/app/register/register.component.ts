import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../users.service';

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
    private readonly router: Router
  ) { }

  async handleSubmit() {
    // Check if all fields are filled
    if (!this.formData.username || !this.formData.email || !this.formData.password || !this.formData.confirmPassword) {
      this.showError('Please fill in all fields.');
      return;
    }

    // Check if passwords match
    if (this.formData.password !== this.formData.confirmPassword) {
      this.showError('Passwords do not match.');
      return;
    }

    // Confirm registration with user
    const confirmRegistration = confirm('Are you sure you want to register this user?');
    if (!confirmRegistration) {
      return;
    }

    try {
      const response = await this.userService.register(this.formData);
      if (response.statusCode === 200) {
        // Clear form fields
        this.formData = {
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        };

        // Navigate to login page
        this.router.navigate(['/login']).then(() => {
          console.log('Navigation to login successful');
        }).catch(error => {
          console.error('Navigation error:', error);
        });
      } else {
        this.showError(response.message);
      }
    } catch (error: any) {
      this.showError(error.message || 'An error occurred during registration.');
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']).then(() => {
      console.log('Navigation to login successful');
    }).catch(error => {
      console.error('Navigation error:', error);
    });
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = ''; // Clear the error message after the specified duration
    }, 3000);
  }
}
