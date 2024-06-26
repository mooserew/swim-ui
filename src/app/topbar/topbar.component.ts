import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth_service';
import { HttpClient } from '@angular/common/http';
import { ProfilePictureService } from './../services/profile-picture.service';

interface User {
  userId: number;
  userName: string;
  profilePicture?: string | null; // Add this field
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  searchResults: User[] = [];
  searchTerm: string = ''; 
  username: string = '';
  userId: number | undefined; 
  profilePictureUrl: string = ''; 

  constructor(private authService: AuthService, private http: HttpClient, private profilePictureService: ProfilePictureService) {}

  ngOnInit(): void {
    this.authService.getUsernameFromToken().then((username) => {
      this.username = username;
      this.fetchUserId(); 
    });
  }

  fetchUserId() {
    this.http.get<number>(`https://swim-api-production-1a4b.up.railway.app/Swim/user/userId`, { withCredentials: true })
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
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
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
          },
          (error) => {
            console.error('Error fetching profile picture:', error);
            user.profilePicture = 'default.png'; // Default picture in case of error
          }
        );
      }
    });
  }
}
