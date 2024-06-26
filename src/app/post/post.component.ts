import { Component, Input, OnInit } from '@angular/core';
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
export class PostComponent implements OnInit {
  @Input() post: any; 
  liked: boolean = false; 
  likeCount: number = 0; 
  embedUrl: SafeResourceUrl = ''; 
  embedWidth: string = '300'; 
  embedHeight: string = '80'; 
  profilePictureUrl: string = ''; 

  constructor(private http: HttpClient, private modalService: NgbModal, private sanitizer: DomSanitizer, private profilePictureService: ProfilePictureService) { }

  ngOnInit() {
    this.fetchLikeStatus();
    this.fetchLikeCount();
    this.processContent();
    this.fetchProfilePicture(); 
  }

  fetchProfilePicture() {
    if (this.post.userId) {
      this.profilePictureService.getProfilePictureUrl(this.post.userId).subscribe(
        (url: string) => {
          this.profilePictureUrl = url;
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
        }
      );
    }
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
    const matches: RegExpMatchArray | null = this.post.content.match(spotifyUrlPattern);
    if (matches) {
      matches.forEach((spotifyUrl: string) => {
        const type: string = this.detectSpotifyType(spotifyUrl);
        this.setEmbedSize(type);
        this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generateEmbedUrl(spotifyUrl, type));
        this.post.content = this.post.content.replace(spotifyUrl, `<a href="${spotifyUrl}" target="_blank">${spotifyUrl}</a>`);
      });
    }
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
        this.embedWidth = '600';
        this.embedHeight = '380';
        break;
      case 'playlist':
      case 'album':
        this.embedWidth = '600';
        this.embedHeight = '380';
        break;
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
  }
}
