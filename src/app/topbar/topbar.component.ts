import { Component } from '@angular/core';
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
export class TopbarComponent {
  searchResults: User[] = [];
  searchTerm: string = ''; // Variable to store search term

  constructor(private http: HttpClient) {}

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
      this.http.get<User[]>(`http://localhost:8080/Swim/files/get-users?name=${query}`)
        .subscribe(results => {
          this.searchResults = results;
        });
    } else {
      this.searchResults = [];
    }
  }
}
