import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private feedUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/post/all';
  private profilePostsUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/post/get';
  private createPostUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/post/create';
  private followedPostsUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/post/following';
  

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.cookieService.get('jwtToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPosts(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.feedUrl, { headers, withCredentials: true });
  }

  getPostsByUserName(username: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const url = `${this.profilePostsUrl}/${username}`;
    return this.http.get(url, { headers, withCredentials: true });
  }

  getPostsByFollowing(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.followedPostsUrl, { headers, withCredentials: true });
  }

  createPost(content: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const postRequest = { content };
    return this.http.post(this.createPostUrl, postRequest, { headers, withCredentials: true });
  }
}
