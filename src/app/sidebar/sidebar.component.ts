import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth_service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  username: string = '';
  showDeleteConfirm: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.authService
      .getUsernameFromToken()
      .then((username) => (this.username = username));
  }

  login(): void {
    const accessToken = localStorage.getItem('spotify_access_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!accessToken || !refreshToken) {
      window.location.href = 'https://swim-api-production-1a4b.up.railway.app/spotify/login';
    } else {
      console.log('User already authenticated');
    }
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteAccount(): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
      responseType: 'text' as 'json',  // Specify the response type as text
    };

    this.http.delete('https://swim-api-production-1a4b.up.railway.app/Swim/user/delete-account', httpOptions)
      .subscribe({
        next: (response: any) => {
          console.log('Account deleted successfully');
          // Call the logout method to expire the cookie
          this.authService.logout().subscribe({
            next: () => {
              // Redirect to the login page after account deletion and logout
              this.router.navigate(['/login']);
            },
            error: (logoutError) => {
              console.error('Error during logout after account deletion', logoutError);
              this.router.navigate(['/login']);
            }
          });
        },
        error: (error: any) => {
          console.error('Error deleting account', error);
        }
      });
    this.showDeleteConfirm = false;
  }
}
