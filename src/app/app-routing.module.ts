import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../app/guards/auth.guards';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { RegisterComponent } from './register/register.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { RequestPageComponent } from './request-page/request-page.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { UserStatsComponent } from './user-stats/user-stats.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'home',
    component: MainComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile/:username', 
    component: UserProfileComponent,
  },
  {
    path: 'password-request', 
    component: RequestPageComponent
  },
  { path: 'reset-password', 
    component: PasswordResetComponent 
  },
  {
    path: 'stats', 
    component: UserStatsComponent,
  },
  { path: 'stats', component: UserStatsComponent },
  { path: 'callback', component: UserStatsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}