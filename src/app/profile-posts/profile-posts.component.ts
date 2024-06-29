import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/PostService';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css']
})
export class ProfilePostsComponent implements OnInit, OnDestroy {
  posts: any[] = [];
  username: string = '';
  private routeSub: Subscription | undefined;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      const usernameFromRoute = params['username'];
      if (usernameFromRoute) {
        this.username = usernameFromRoute;
        this.loadPosts();
      } else {
        console.error('No username provided in route');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  loadPosts(): void {
    // Clear the current posts
    this.posts = [];

    this.postService.getPostsByUserName(this.username).subscribe(
      (data: any[]) => {
        if (data && data.length > 0) {
          // Sort posts by createdAt in descending order
          this.posts = data.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Sort descending
          });
        }
      },
      error => {
        console.error('Error fetching posts:', error);
      }
    );
  }
}
