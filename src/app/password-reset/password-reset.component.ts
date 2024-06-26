import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  newPassword: string = '';
  isPasswordVisible: boolean = false;
  token: string = '';
  message: string = '';
  messageType: string = ''; // 'success' or 'error'

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const tokenParam = this.route.snapshot.queryParamMap.get('token');
    if (tokenParam) {
      this.token = tokenParam;
    } else {
      this.message = 'Invalid password reset token.';
      this.messageType = 'error';
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(form: any) {
    if (form.valid) {
      const params = new HttpParams()
        .set('token', this.token)
        .set('newPassword', this.newPassword);
  
      this.http.post('https://swim-api-production-1a4b.up.railway.app/password/reset', params, { observe: 'response' }).subscribe(
        response => {
          if (response.status === 200) {
            this.message = 'Password has been reset successfully.';
            this.messageType = 'success';
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error => {
          if (error.status !== 200) { // Check if there's an actual error
            this.message = 'Error resetting password.';
            this.messageType = 'error';
          }
        }
      );
    }
  }
}
