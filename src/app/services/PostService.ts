import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private feedUrl = 'https://swim-api-production-1a4b.up.railway.app/post/following';
  private profilePostsUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim/post/get';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(this.feedUrl, { withCredentials: true });
  }

  getPostsByUserName(username: string): Observable<any> {
    const url = `${this.profilePostsUrl}/${username}`;
    return this.http.get(url, { withCredentials: true });
  }
}
