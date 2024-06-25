import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any;
  userId: number | undefined;
  currentUserId: number | undefined;
  isFollowing: boolean = false;
  private baseUrl = 'https://swim-api-production-1a4b.up.railway.app/';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.getUserByUsername(username).subscribe((data) => {
        this.user = data;
        this.userId = data.userId;
        this.checkIfFollowing();
      });
    }

    this.getCurrentUserId().subscribe((data) => {
      this.currentUserId = data;
    });
  }

  getUserByUsername(username: string) {
    return this.http.get<any>(`${this.baseUrl}/user/username/${username}`);
  }

  getCurrentUserId() {
    return this.http.get<number>(`${this.baseUrl}/user/userId`, { withCredentials: true });
  }

  checkIfFollowing(): void {
    if (this.userId) {
      this.http.get<boolean>(`${this.baseUrl}/isFollowing`, {
        params: { followerId: this.userId.toString() },
        withCredentials: true
      }).subscribe((isFollowing) => {
        this.isFollowing = isFollowing;
      });
    }
  }

  toggleFollow(): void {
    if (this.isFollowing) {
      this.unfollowUser();
    } else {
      this.followUser();
    }
  }

  followUser(): void {
    if (this.userId) {
      this.http.post(`${this.baseUrl}/follow`, null, {
        params: { followerId: this.userId.toString() },
        withCredentials: true,
        responseType: 'text'
      }).subscribe(() => {
        this.user.followersCount += 1;
        this.isFollowing = true;
      });
    }
  }

  unfollowUser(): void {
    if (this.userId) {
      this.http.post(`${this.baseUrl}/unfollow`, null, {
        params: { followerId: this.userId.toString() },
        withCredentials: true,
        responseType: 'text'
      }).subscribe(() => {
        this.user.followersCount -= 1;
        this.isFollowing = false;
      });
    }
  }

  openEditProfileModal(): void {
    const modalRef = this.modalService.open(EditProfileModalComponent);
    modalRef.componentInstance.user = this.user;
    modalRef.componentInstance.bioUpdated.subscribe((newBio: string) => {
      this.user.bio = newBio;
    });
  }
}
