import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth_service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService,private http: HttpClient) {}

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
}
