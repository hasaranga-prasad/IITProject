import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ToastrModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private readonly usersService: UsersService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  username: string = '';
  password: string = '';
  errorMessage: string = '';

  async handleSubmit() {
    if (!this.username || !this.password) {
      this.toastr.error('Email and Password are required', 'Login Error');
      return;
    }

    try {
      const response = await this.usersService.login(this.username, this.password);
      if (response.statusCode === 200) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        this.router.navigate(['/dashboard']);
        this.toastr.success('Login successful!', 'Welcome');
      } else {
        this.toastr.error(response.message, 'Login Error');
      }
    } catch (error: any) {
      this.toastr.error(error.message, 'Login Error');
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
