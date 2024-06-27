import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  isPasswordVisible: boolean = false;
  registrationError: string | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(registerForm: NgForm): void {
    const userRegistrationRequest = {
      userName: registerForm.value.username,
      email: registerForm.value.email,
      password: registerForm.value.password
    };

    this.http.post('https://swim-api-production-1a4b.up.railway.app/Swim/register', userRegistrationRequest, { responseType: 'text' })
      .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
        // Handle successful registration response
      }, error => {
        console.error(error);
        if (error.error && typeof error.error === 'string') {
          this.registrationError = error.error; // Assuming error message is a string
        } else {
          this.registrationError = 'An unexpected error occurred. Please try again later.';
        }
      });
  }
}
