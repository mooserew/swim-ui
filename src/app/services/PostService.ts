// src/app/post-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private feedUrl = 'http://localhost:8080/Swim/post/following';
  private profilePostsUrl = 'http://localhost:8080/Swim/post/get';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    const token = this.getTokenFromCookie();
    if (!token) {
      throw new Error('No token found in cookies');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(this.feedUrl, { headers, withCredentials: true });
  }

  getPostsByUserName(username: string): Observable<any> {
    const token = this.getTokenFromCookie();
    if (!token) {
      throw new Error('No token found in cookies');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `${this.profilePostsUrl}/${username}`;
    return this.http.get(url, { headers, withCredentials: true });
  }

  private getTokenFromCookie(): string | null {
    const matches = document.cookie.match(/jwt=([^;]*)/);
    return matches ? matches[1] : null;
  }
}
