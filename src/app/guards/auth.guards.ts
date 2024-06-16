import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth_service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  }
}