import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

interface User {
  userId: number;
  userName: string;
  email: string;
  profilePicture: string;
  bio: string;
}

@Component({
  selector: 'app-recommended-users',
  templateUrl: './recommended-users.component.html',
  styleUrls: ['./recommended-users.component.css']
})
export class RecommendedUsersComponent implements OnInit {
  recommendedUsers: User[] = [];

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.getRecommendedUsers();
  }

  getRecommendedUsers(): void {
    const token = this.cookieService.get('jwt-token'); // Change 'jwt-token' to the actual cookie name

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User[]>('http://localhost:8080/Swim/recommendedUsers', { headers }).subscribe(
      (data) => {
        this.recommendedUsers = data;
      },
      (error) => {
        console.error('Error fetching recommended users', error);
      }
    );
  }

  followUser(userId: number): void {
    const token = this.cookieService.get('jwt'); // Change 'jwt-token' to the actual cookie name

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`http://localhost:8080/Swim/follow?followerId=${userId}`, {}, { headers }).subscribe(
      () => {
        console.log(`Followed user with ID ${userId}`);
      },
      (error) => {
        console.error('Error following user', error);
      }
    );
  }
}
