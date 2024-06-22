import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/PostService';

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.css']
})
export class ProfilePostsComponent implements OnInit {
  posts: any[] = [];
  username: string = ''; // Initialize username with an empty string

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const usernameFromRoute = this.route.snapshot.paramMap.get('username');
    if (usernameFromRoute) {
      this.username = usernameFromRoute;
      this.postService.getPostsByUserName(this.username).subscribe(
        (data: any[]) => {
          // Sort posts by createdAt in descending order
          this.posts = data.sort((a: any, b: any) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA; // Sort descending
          });
        },
        error => {
          console.error('Error fetching posts:', error);
        }
      );
    } else {
      console.error('No username provided in route');
    }
  }
}
