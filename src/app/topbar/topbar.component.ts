import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../services/auth_service';
import { HttpClient } from '@angular/common/http';
import { ProfilePictureService } from './../services/profile-picture.service';

interface User {
  userId: number;
  userName: string;
  profilePicture?: string | null;
  imageLoaded?: boolean;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit, OnDestroy {
  searchResults: User[] = [];
  searchTerm: string = '';
  username: string = '';
  userId: number | undefined;
  profilePictureUrl: string = '';
  imageLoaded: boolean = false;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private profilePictureService: ProfilePictureService
  ) {}

  ngOnInit(): void {
    this.authService.getUsernameFromToken().then((username) => {
      this.username = username;
      this.fetchUserId();
    });

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  fetchUserId() {
    this.http.get<number>('https://swim-api-production-1a4b.up.railway.app/Swim/user/userId', { withCredentials: true })
      .subscribe(
        (userId: number) => {
          this.userId = userId;
          this.fetchProfilePicture();
        },
        (error) => {
          console.error('Error fetching user ID:', error);
        }
      );
  }

  fetchProfilePicture() {
    if (this.userId) {
      this.profilePictureService.getProfilePictureUrl(this.userId).subscribe(
        (url: string) => {
          this.profilePictureUrl = url;
          this.imageLoaded = true;
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
          this.profilePictureUrl = 'default.png';
          this.imageLoaded = true;
        }
      );
    }
  }

  handleInputFocus() {
    this.searchTerm = '';
  }

  handleInputBlur() {
    if (!this.searchTerm) {
      this.searchTerm = 'Search';
    }
  }

  search(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.trim();

    if (query) {
      this.http.get<User[]>(`https://swim-api-production-1a4b.up.railway.app/Swim/user/get-users?name=${query}`, { withCredentials: true })
        .subscribe(results => {
          this.searchResults = results;
          this.fetchProfilePictures();
        });
    } else {
      this.searchResults = [];
    }
  }

  fetchProfilePictures() {
    this.searchResults.forEach((user) => {
      if (user.userId) {
        this.profilePictureService.getProfilePictureUrl(user.userId).subscribe(
          (url: string) => {
            user.profilePicture = url;
            user.imageLoaded = true;
          },
          (error) => {
            console.error('Error fetching profile picture:', error);
            user.profilePicture = 'default.png';
            user.imageLoaded = true;
          }
        );
      }
    });
  }

  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const searchBox = document.querySelector('.input-group');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (searchBox && !searchBox.contains(target) && dropdownMenu && !dropdownMenu.contains(target)) {
      this.searchResults = [];
    }
  }

  handleImageError(event: Event, user?: User) {
    const target = event.target as HTMLImageElement;
    target.src = 'default.png';
    if (user) {
      user.imageLoaded = true;
    } else {
      this.imageLoaded = true;
    }
  }
}
