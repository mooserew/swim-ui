import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProfilePictureService } from './../services/profile-picture.service'; // Import ProfilePictureService

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {
  @Input() post: any; // Input property to receive post data from parent component
  liked: boolean = false; // Track if the post is liked or not
  likeCount: number = 0; // Track the number of likes
  sanitizedContent: string = ''; // Variable to store sanitized content
  embedUrl: SafeResourceUrl = ''; // Embed URL for the Spotify player
  embedWidth: string = '300'; // Default width for embeds
  embedHeight: string = '80'; // Default height for embeds
  profilePictureUrl: string = ''; // Variable to store profile picture URL

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private profilePictureService: ProfilePictureService) {}

  ngOnInit() {
    // Initialize like state and count
    this.fetchLikeStatus();
    this.fetchLikeCount();
    this.processContent();
    this.fetchProfilePicture(); // Fetch profile picture
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
        this.fetchLikeCount(); // Update like count after liking
      }, error => {
        console.error('Error liking post:', error);
      });
  }

  unlikePost() {
    this.http.delete(`https://swim-api-production-1a4b.up.railway.app/Swim/post/unlike?postId=${this.post.postId}`, { withCredentials: true })
      .subscribe(() => {
        this.liked = false;
        this.fetchLikeCount(); // Update like count after unliking
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
    const spotifyUrlPattern = /https:\/\/open\.spotify\.com\/(track|playlist|album|artist)\/[a-zA-Z0-9]+|https:\/\/open\.spotify\.com\/intl-[a-zA-Z0-9-]+\/(track|playlist|album|artist)\/[a-zA-Z0-9]+/;
    const match = this.post.content.match(spotifyUrlPattern);
    if (match) {
      const spotifyUrl = match[0];
      const type = this.detectSpotifyType(spotifyUrl);
      this.setEmbedSize(type);
      this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.generateEmbedUrl(spotifyUrl, type));
      this.sanitizedContent = this.post.content.replace(spotifyUrl, `<a href="${spotifyUrl}" target="_blank">${spotifyUrl}</a>`);
    } else {
      this.sanitizedContent = this.post.content;
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
      case 'playlist':
      case 'album':
      case 'artist':
        this.embedWidth = '725';
        this.embedHeight = '200';
        break;
      default:
        this.embedWidth = '725';
        this.embedHeight = '200';
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

  fetchProfilePicture() {
    if (this.post.userId) {
      this.profilePictureService.getProfilePictureUrl(this.post.userId).subscribe(
        (url: string) => {
          this.profilePictureUrl = url;
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
          this.profilePictureUrl = 'default.png'; // Default picture in case of error
        }
      );
    }
  }
}
