import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotifyAuthService } from '../services/spotify-auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.css']
})
export class UserStatsComponent implements OnInit {
  topTracks: any[] = [];
  topArtists: any[] = [];
  accessToken: string | null = null;

  constructor(
    private spotifyAuthService: SpotifyAuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.spotifyAuthService.handleCallback(code).subscribe(response => {
          this.accessToken = response.accessToken;
          if (this.accessToken) {
            localStorage.setItem('spotify_access_token', this.accessToken);
          }
          const refreshToken = response.refreshToken;
          if (refreshToken) {
            localStorage.setItem('spotify_refresh_token', refreshToken);
          }
          this.router.navigate(['/stats']); // Redirect to /stats after storing tokens
        }, error => {
          console.error('Error handling callback', error);
          this.login();
        });
      } else {
        this.accessToken = localStorage.getItem('spotify_access_token');
        const refreshToken = localStorage.getItem('spotify_refresh_token');
        if (this.accessToken) {
          this.getTopArtistsAndTracks(this.accessToken);
        } else if (refreshToken) {
          this.spotifyAuthService.refreshAccessToken(refreshToken).subscribe(response => {
            this.accessToken = response.accessToken;
            if (this.accessToken) {
              localStorage.setItem('spotify_access_token', this.accessToken);
              this.getTopArtistsAndTracks(this.accessToken);
            }
          }, error => {
            console.error('Error refreshing access token', error);
            this.login();
          });
        } else {
          this.login();
        }
      }
    });
  }

  getTopArtistsAndTracks(accessToken: string): void {
    this.spotifyAuthService.getUserTopArtists(accessToken).pipe(
      switchMap(data => {
        this.topArtists = data.items;
        return this.spotifyAuthService.getUserTopTracks(accessToken);
      }),
      catchError(error => {
        console.error('Error fetching top artists or tracks', error);
        this.login();
        return of(null); // Return a null observable to handle the error gracefully
      })
    ).subscribe(data => {
      if (data) {
        this.topTracks = data.items;
      }
    });
  }

  login(): void {
    this.spotifyAuthService.login();
  }

  logoutFromSpotify(): void {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    this.router.navigate(['/home']);
  }
}
