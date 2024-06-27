import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthService } from './services/auth_service';
import { LogoutComponent } from './logout/logout.component';
import { PostFeedComponent } from './post-feed/post-feed.component';
import { PostComponent } from './post/post.component';
import { PostCreateModalComponent } from './post-create-modal/post-create-modal.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RegisterComponent } from './register/register.component';
import { CommentModalComponent } from './comment-modal/comment-modal.component';
import { CommentFeedComponent } from './comment-feed/comment-feed.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ProfilePostsComponent } from './profile-posts/profile-posts.component';
import { RequestPageComponent } from './request-page/request-page.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { EditProfileModalComponent } from './edit-profile-modal/edit-profile-modal.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { UserStatsComponent } from './user-stats/user-stats.component';
import { RecommendedUsersComponent } from './recommended-users/recommended-users.component';
import { FollowingFeedComponent } from './following-feed/following-feed.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    SidebarComponent,
    LogoutComponent,
    PostFeedComponent,
    PostComponent,
    PostCreateModalComponent,
    TopbarComponent,
    RegisterComponent,
    CommentModalComponent,
    CommentFeedComponent,
    UserProfileComponent,
    ProfilePostsComponent,
    RequestPageComponent,
    PasswordResetComponent,
    EditProfileModalComponent,
    SafeUrlPipe,
    UserStatsComponent,
    RecommendedUsersComponent,
    FollowingFeedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    NgbModalModule,
    MatListModule,
    MatDialogModule,
    MatDividerModule,
    MatSidenavModule,
    MatSnackBarModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule // Include ReactiveFormsModule here
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
