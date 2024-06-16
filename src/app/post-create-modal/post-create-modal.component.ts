import { Component, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-post-create-modal',
  templateUrl: './post-create-modal.component.html',
  styleUrls: ['./post-create-modal.component.css']
})
export class PostCreateModalComponent {
  @ViewChild('postModal', { static: true }) postModal!: TemplateRef<any>;
  postContent: string = '';

  constructor(private http: HttpClient, private modalService: NgbModal, private cookieService: CookieService) {}

  openModal() {
    this.modalService.open(this.postModal);
  }

  createPost(modal: any) {
    const token = this.cookieService.get('jwtToken'); // Get the JWT token from cookies
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const postRequest = {
      content: this.postContent
    };

    this.http.post('http://localhost:8080/Swim/post/create', postRequest, { headers, withCredentials: true })
      .subscribe(response => {
        console.log('Post created:', response);
        modal.close();
      }, error => {
        console.error('Error creating post:', error);
      });
  }
}
