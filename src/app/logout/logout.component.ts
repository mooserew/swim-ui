import { Component } from '@angular/core';
import { AuthService } from '../services/auth_service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logout',
    template: `
        <a (click)="logout()" class="nav-link">
            <i class="bx bx-log-out icon"></i>
            <span class="link">Sair</span>
        </a>
    `,
    styles: [`
        .nav-link {
            display: flex;
            align-items: center;
            padding: 14px 12px;
            border-radius: 8px;
            text-decoration: none;
            color: #F9F6EE;
            transition: background-color 0.3s ease;
        }

        .nav-link:hover {
            background-color: #4070f4;
            cursor: pointer;
        }

        .icon {
            margin-right: 14px;
            font-size: 20px;
            color: #707070;
        }

        .link {
            font-size: 16px;
            font-weight: 400;
        }

        .nav-link:hover .icon,
        .nav-link:hover .link {
            color: #fff;
        }
    `]
})
export class LogoutComponent {

  constructor(private authService: AuthService, private router: Router) {}


  logout() {

    this.authService.logout().subscribe({

      next: () => {

        console.log('Logged out successfully');

      },

      error: (error) => {

        console.error('Logout failed', error);

      }

    });

  }

}