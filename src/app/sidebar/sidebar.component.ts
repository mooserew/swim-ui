import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth_service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  username: string ="";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUsernameFromToken()
     .then(username => this.username = username);
  }

}