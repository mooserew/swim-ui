import { Component, Input, OnInit, Renderer2, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommentModalComponent } from '../comment-modal/comment-modal.component';
import { ProfilePictureService } from './../services/profile-picture.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit, OnDestroy {
  @Input() post: any;
  liked: boolean = false;
  likeCount: number = 0;
  sanitizedContent: string = '';
  embedUrl: SafeResourceUrl = '';
  embedWidth: string = '300';
  embedHeight: string = '80';
  profilePictureUrl: string = '';
  authenticatedUserId: number | null = null;
  private documentClickListener: (() => void) | null = null;
  defaultProfilePictureUrl: string = 'assets/placeholder-profile-pic.png'; // Placeholder image path

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private profilePictureService: ProfilePictureService,
    private renderer: Renderer2
  ) {}

  async ngOnInit(): Promise<void> {
    this.authenticatedUserId = await this.getAuthenticatedUserId();
    this.fetchLikeStatus();
    this.fetchLikeCount();
    this.processContent();
    this.fetchProfilePicture();

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

  async getAuthenticatedUserId(): Promise<number | null> {
    try {
      const response = await this.http.get<{ id?: number }>('https://swim-api-production-1a4b.up.railway.app/Swim/userid', { withCredentials: true }).toPromise();
      return response?.id ?? null;
    } catch (error) {
      console.error('Error fetching authenticated user ID:', error);
      return null;
    }
  }

  fetchProfilePicture() {
    if (this.post.userId) {
      this.profilePictureService.getProfilePictureUrl(this.post.userId).subscribe(
        (url: string) => {
          this.profilePictureUrl = url;
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
          this.profilePictureUrl = this.defaultProfilePictureUrl; // Use placeholder on error
        }
      );
    }
  }

  onImageLoad() {
    // Image loaded successfully, no action needed
  }

  onImageError() {
    this.profilePictureUrl = this.defaultProfilePictureUrl; // Fallback to placeholder image
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
    this.http.post(`https://swim-api-production-1a4b.up.railway.app/Swim/post/like?postId=${this.post.postId}`, null, { withCredentials: true })
      .subscribe(() => {
        this.liked = true;
        this.fetchLikeCount();
      }, error => {
        console.error('Error liking post:', error);
      });
  }

  unlikePost() {
    this.http.delete(`https://swim-api-production-1a4b.up.railway.app/Swim/post/unlike?postId=${this.post.postId}`, { withCredentials: true })
      .subscribe(() => {
        this.liked = false;
        this.fetchLikeCount();
      }, error => {
        console.error('Error unliking post:', error);
      });
  }

  fetchLikeStatus() {
    this.http.get<number[]>(`https://swim-api-production-1a4b.up.railway.app/Swim/post/liked-posts`, { withCredentials: true })
      .subscribe((likedPostIds: number[]) => {
        this.liked = likedPostIds.includes(this.post.postId);
      }, error => {
        console.error('Error fetching like status:', error);
      });
  }

  fetchLikeCount() {
    this.http.get<number>(`https://swim-api-production-1a4b.up.railway.app/Swim/post/like-count/${this.post.postId}`, { withCredentials: true })
      .subscribe((count: number) => {
        this.likeCount = count;
      }, error => {
        console.error('Error fetching like count:', error);
      });
  }

  processContent() {
    const spotifyUrlPattern: RegExp = /https:\/\/open\.spotify\.com\/(intl-[a-zA-Z0-9-]+\/)?(track|playlist|album|artist)\/[a-zA-Z0-9?&=._-]+/g;
    let content = this.post.content;
    const matches: RegExpMatchArray | null = content.match(spotifyUrlPattern);
    if (matches) {
      matches.forEach((spotifyUrl: string) => {
        const type: string = this.detectSpotifyType(spotifyUrl);
        this.setEmbedSize(type);
        this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generateEmbedUrl(spotifyUrl, type));
        content = content.replace(spotifyUrl, '');
      });
    }
    this.sanitizedContent = content;
  }

  detectSpotifyType(url: string): string {
    if (url.includes('track')) {
      return 'track';
    } else if (url.includes('playlist')) {
      return 'playlist';
    } else if (url.includes('album')) {
      return 'album';
    } else if (url.includes('artist')) {
      return 'artist';
    }
    return '';
  }

  setEmbedSize(type: string): void {
    switch (type) {
      case 'track':
      case 'playlist':
      case 'album':
      case 'artist':
        this.embedWidth = '600';
        this.embedHeight = '380';
        break;
      default:
        this.embedWidth = '600';
        this.embedHeight = '380';
        break;
    }
  }

  generateEmbedUrl(url: string, type: string): string {
    const id = this.extractIdFromUrl(url);
    return `https://open.spotify.com/embed/${type}/${id}`;
  }

  extractIdFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1].split('?')[0];
  }

  openCommentModal() {
    const modalRef = this.modalService.open(CommentModalComponent, { size: 'lg' });
    modalRef.componentInstance.post = this.post;
    modalRef.componentInstance.sanitizedContent = this.sanitizedContent;
    modalRef.componentInstance.embedUrl = this.embedUrl;
    modalRef.componentInstance.embedWidth = this.embedWidth;
    modalRef.componentInstance.embedHeight = this.embedHeight;
  }

  toggleMenu(event: MouseEvent, post: any) {
    event.stopPropagation();
    post.showMenu = !post.showMenu;
  }

  handleDocumentClick(event: MouseEvent) {
    if (this.post) {
      this.post.showMenu = false;
    }
  }

  deletePost(postId: number) {
    const options = {
      withCredentials: true
    };

    this.http.delete(`https://swim-api-production-1a4b.up.railway.app/Swim/post/delete/${postId}`, options)
      .subscribe(() => {
        // Handle successful deletion (e.g., removing the post from the view)
      }, error => {
        console.error('Error deleting post:', error);
      });
  }
}
