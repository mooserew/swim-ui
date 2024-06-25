import { Component, OnInit } from '@angular/core';
import { AuthService } from './../services/auth_service';
import { HttpClient } from '@angular/common/http';

interface User {
  userId: number;
  userName: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent implements OnInit {
  searchResults: User[] = [];
  searchTerm: string = ''; // Variable to store search term
  username: string = '';

  constructor(private authService: AuthService,private http: HttpClient) {}

  ngOnInit(): void {
    this.authService
      .getUsernameFromToken()
      .then((username) => (this.username = username));
  }
  // Function to handle input focus
  handleInputFocus() {
    this.searchTerm = ''; // Clear search term when focused
  }

  // Function to handle input blur (when focus is lost)
  handleInputBlur() {
    if (!this.searchTerm) {
      this.searchTerm = 'Search'; // Restore placeholder if input is empty
    }
  }

  // Function to handle search
  search(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value.trim();

    if (query) {
      this.http.get<User[]>(`https://swim-api-production-1a4b.up.railway.app/user/get-users?name=${query}`)
        .subscribe(results => {
          this.searchResults = results;
        });
    } else {
      this.searchResults = [];
    }
  }
}
