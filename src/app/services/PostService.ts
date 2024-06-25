import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private feedUrl = 'https://swim-api-production-1a4b.up.railway.app/post/following';
  private profilePostsUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/post/get';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

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
    return this.cookieService.get('jwt');
  }
}
