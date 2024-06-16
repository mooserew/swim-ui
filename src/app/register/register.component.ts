import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'] // Note: corrected styleUrls
})
export class RegisterComponent {
  isPasswordVisible: boolean = false; // Declare isPasswordVisible property

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
