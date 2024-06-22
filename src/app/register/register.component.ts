import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isPasswordVisible = false;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  togglePasswordVisibility() {
    this.isPasswordVisible =!this.isPasswordVisible;
  }

  onSubmit(loginForm: NgForm) {
    const userRegistrationRequest = {
      userName: loginForm.value.username,
      email: loginForm.value.email,
      password: loginForm.value.password
    };

    this.http.post('http://localhost:8080/Swim/register', userRegistrationRequest, { responseType: 'text' })
     .subscribe(response => {
        console.log(response);
        this.router.navigate(['/login']);
        // Handle successful registration response
      }, error => {
        console.error(error);
        // Handle registration error
      });
  }
}