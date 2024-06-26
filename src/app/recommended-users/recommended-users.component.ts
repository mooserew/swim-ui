import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProfilePictureService } from './../services/profile-picture.service';

interface UserDTO {
  userId: number;
  userName: string;
  profilePicture: string | null;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

@Component({
  selector: 'app-recommended-users',
  templateUrl: './recommended-users.component.html',
  styleUrls: ['./recommended-users.component.css']
})
export class RecommendedUsersComponent implements OnInit {
  recommendedUsers: UserDTO[] = [];
  private baseUrl = 'https://swim-api-production-1a4b.up.railway.app/Swim';
  currentUserId: number | undefined;

  constructor(private http: HttpClient, private profilePictureService: ProfilePictureService) {}

  ngOnInit(): void {
    this.fetchRecommendedUsers();
    this.getCurrentUserId().subscribe((data) => {
      this.currentUserId = data;
    });
  }

  fetchRecommendedUsers(): void {
    this.http.get<UserDTO[]>('https://swim-api-production-1a4b.up.railway.app/Swim/recommendedUsers', { withCredentials: true }).subscribe(
      (data: UserDTO[]) => {
        this.recommendedUsers = data;
        this.fetchProfilePictures();
        this.checkIfFollowing();
      },
      (error) => {
        console.error('Error fetching recommended users', error);
      }
    );
  }

  getCurrentUserId() {
    return this.http.get<number>(`${this.baseUrl}/user/userId`, { withCredentials: true });
  }

  fetchProfilePictures(): void {
    this.recommendedUsers.forEach((user) => {
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

  checkIfFollowing(): void {
    this.recommendedUsers.forEach((user) => {
      this.http.get<boolean>(`${this.baseUrl}/isFollowing`, {
        params: { followerId: user.userId.toString() },
        withCredentials: true
      }).subscribe((isFollowing) => {
        user.isFollowing = isFollowing;
      });
    });
  }

  toggleFollow(user: UserDTO): void {
    if (user.isFollowing) {
      this.unfollowUser(user);
    } else {
      this.followUser(user);
    }
  }

  followUser(user: UserDTO): void {
    this.http.post(`${this.baseUrl}/follow`, null, {
      params: { followerId: user.userId.toString() },
      withCredentials: true,
      responseType: 'text'
    }).subscribe(() => {
      user.followersCount += 1;
      user.isFollowing = true;
    });
  }

  unfollowUser(user: UserDTO): void {
    this.http.post(`${this.baseUrl}/unfollow`, null, {
      params: { followerId: user.userId.toString() },
      withCredentials: true,
      responseType: 'text'
    }).subscribe(() => {
      user.followersCount -= 1;
      user.isFollowing = false;
    });
  }
}
