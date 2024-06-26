import { Component, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-comment-feed',
  templateUrl: './comment-feed.component.html',
  styleUrls: ['./comment-feed.component.css']
})
export class CommentFeedComponent implements OnInit, OnDestroy {
  comments: any[] = [];
  newComment: string = '';
  @Input() post: any;
  authenticatedUserId: number | null = null;
  private documentClickListener: (() => void) | null = null;

  constructor(private http: HttpClient, private renderer: Renderer2, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.authenticatedUserId = this.getAuthenticatedUserId();
    console.log('Authenticated User ID:', this.authenticatedUserId); // Debug log
    this.loadComments();

    // Add document click listener
    this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
      this.handleDocumentClick(event);
    });
  }

  ngOnDestroy(): void {
    // Remove document click listener when component is destroyed
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }

  getAuthenticatedUserId(): number | null {
    const userId = this.cookieService.get('jwtToken');
    return userId ? Number(userId) : null;
  }

  loadComments() {
    const options = {
      withCredentials: true
    };

    this.http.get<any[]>(`https://swim-api-production-1a4b.up.railway.app/Swim/post/get-comments/${this.post.postId}`, options)
      .subscribe(data => {
        this.comments = data.reverse(); // Reverse the order of comments
        console.log('Comments:', this.comments); // Debug log
      });
  }

  addComment() {
    if (this.newComment.trim() === '') return;

    if (!this.post.postId) return;

    const formData = new FormData();
    formData.append('content', this.newComment);

    const options = {
      withCredentials: true
    };

    this.http.post<any>(`https://swim-api-production-1a4b.up.railway.app/Swim/post/comment/${this.post.postId}`, formData, options)
      .subscribe((comment: any) => {
        this.comments.unshift(comment); // Add the new comment at the beginning
        this.newComment = '';
      });
  }

  toggleMenu(event: MouseEvent, comment: any) {
    event.stopPropagation(); // Prevent the event from bubbling up to the document
    comment.showMenu = !comment.showMenu;
    if (comment.showMenu) {
      // Close other menus
      this.comments.forEach(c => {
        if (c !== comment) {
          c.showMenu = false;
        }
      });
    }
  }

  handleDocumentClick(event: MouseEvent) {
    // Close all menus if the click is outside of a menu
    this.comments.forEach(comment => {
      comment.showMenu = false;
    });
  }

  deleteComment(commentId: number) {
    const options = {
      withCredentials: true
    };

    this.http.delete(`https://swim-api-production-1a4b.up.railway.app/Swim/post/delete-comment/${commentId}`, options)
      .subscribe(() => {
        this.comments = this.comments.filter(comment => comment.commentId !== commentId);
      });
  }
}
