import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/PostService';

@Component({
  selector: 'app-post-feed',
  templateUrl: './post-feed.component.html',
  styleUrls: ['./post-feed.component.css']
})
export class PostFeedComponent implements OnInit {
  posts: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPosts().subscribe(
      (data: any[]) => { // Specify data as an array of any type
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
  }
}
