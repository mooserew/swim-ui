import { Component } from '@angular/core';
import { AuthService } from '../services/auth_service'; // Adjust the path as needed
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  isPasswordVisible: boolean = false;
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(form: any): void {
    if (form.valid) {
      const username = form.value.username;
      const password = form.value.password;
  
      this.authService.login({ username, password }).subscribe({
        next: (loginResponse) => {
          // Handle successful login
          console.log('Login successful');
        },
        error: (error) => {
          console.error('Login error:', error);
          if (error.error && error.error.message) {
            // Check for specific error message from server response
            this.loginError = error.error.message;
          } else if (error.status === 404) {
            this.loginError = 'Username not found.';
          } else if (error.status === 401) {
            this.loginError = 'Incorrect username or password.';
          } else {
            this.loginError = 'An unexpected error occurred. Please try again later.';
          }
        }
      });
    }
  }
}