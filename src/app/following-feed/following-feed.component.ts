import { Component, ViewChild } from '@angular/core';
import { PostService } from '../services/PostService';
import { PostCreateModalComponent } from '../post-create-modal/post-create-modal.component';


@Component({
  selector: 'app-following-feed',
  templateUrl: './following-feed.component.html',
  styleUrl: './following-feed.component.css'
})
export class FollowingFeedComponent {
  @ViewChild(PostCreateModalComponent) postCreateModal!: PostCreateModalComponent;
  posts: any[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.postService.getPostsByFollowing().subscribe(
      (data: any[]) => {
        this.posts = data.sort((a: any, b: any) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
      },
      error => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  openPostModal() {
    this.postCreateModal.openModal();
  }
  
}
