import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent {
  @Input() post: any; // Input property to receive post data from parent component
  liked: boolean = false; // Track if the post is liked or not
  likeCount: number = 0; // Track the number of likes

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Initialize like state and count
    this.fetchLikeStatus();
    this.fetchLikeCount();
  }

  formatDate(date: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  }

  toggleLike() {
    if (this.liked) {
      this.unlikePost();
    } else {
      this.likePost();
    }
  }

  likePost() {
    this.http.post(`http://localhost:8080/Swim/post/like?postId=${this.post.postId}`, null, { withCredentials: true })
      .subscribe(() => {
        this.liked = true;
        this.fetchLikeCount(); // Update like count after liking
      }, error => {
        console.error('Error liking post:', error);
      });
  }

  unlikePost() {
    this.http.delete(`http://localhost:8080/Swim/post/unlike?postId=${this.post.postId}`, { withCredentials: true })
      .subscribe(() => {
        this.liked = false;
        this.fetchLikeCount(); // Update like count after unliking
      }, error => {
        console.error('Error unliking post:', error);
      });
  }

  fetchLikeStatus() {
    this.http.get<number[]>(`http://localhost:8080/Swim/post/liked-posts`, { withCredentials: true })
      .subscribe((likedPostIds: number[]) => {
        this.liked = likedPostIds.includes(this.post.postId);
      }, error => {
        console.error('Error fetching like status:', error);
      });
  }

  fetchLikeCount() {
    this.http.get<number>(`http://localhost:8080/Swim/post/like-count/${this.post.postId}`, { withCredentials: true })
      .subscribe((count: number) => {
        this.likeCount = count;
      }, error => {
        console.error('Error fetching like count:', error);
      });
  }
}
