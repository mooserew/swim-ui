import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-page',
  templateUrl: './request-page.component.html',
  styleUrls: ['./request-page.component.css']
})
export class RequestPageComponent {
  email: string = '';
  message: string = '';
  messageType: string = ''; // 'success' or 'error'
  isSubmitting: boolean = false; // Control the disabled state of the button

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: any) {
    if (form.valid) {
      // Display the success message immediately and disable the button
      this.message = 'Password reset email sent. This may take some time.';
      this.messageType = 'success';
      this.isSubmitting = true;

      const params = new HttpParams().set('email', this.email);
      this.http.post('https://swim-api-production-1a4b.up.railway.app/password/request-reset', params, { observe: 'response' }).subscribe(
        response => {
          if (response.status === 200) {
            // Success response handling can be placed here if needed
          }
        },
        error => {
          this.isSubmitting = false; // Re-enable the button on error
          if (error.status === 404) {
            this.message = 'No account found for this email.';
            this.messageType = 'error';
          }
        }
      );
    }
  }
}
