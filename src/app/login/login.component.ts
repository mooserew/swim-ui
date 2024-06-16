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

  constructor(private authService: AuthService, private router: Router) { }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(form: any): void {
    if (form.valid) {
      const username = form.value.username;
      const password = form.value.password;

      this.authService.login({ username, password }).subscribe({
        next: () => {
          // Handle successful login (redirect, toast message, etc.)
          console.log('Login successful');
          
          // Redirect to the index or any other route upon successful login
          this.router.navigate(['']); // Adjust '/index' to your desired route
        },
        error: (error) => {
          console.error('Login error:', error);
          // Display error message to the user
          // Example: this.loginFailToast.toast('show');
        }
      });
    }
  }
}
