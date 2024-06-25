import { Component, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Toast } from 'bootstrap';

@Component({
  selector: 'app-post-create-modal',
  templateUrl: './post-create-modal.component.html',
  styleUrls: ['./post-create-modal.component.css']
})
export class PostCreateModalComponent implements AfterViewInit {
  @ViewChild('postModal', { static: true }) postModal!: TemplateRef<any>;
  @ViewChild('postSuccessToast') postSuccessToast!: ElementRef;
  @ViewChild('postErrorToast') postErrorToast!: ElementRef;
  postContent: string = '';

  constructor(private http: HttpClient, private modalService: NgbModal, private cookieService: CookieService) {}

  ngAfterViewInit() {
    // This will be called after the view has been initialized
    // Ensuring that the ViewChild elements are properly referenced
    if (!this.postSuccessToast) {
      console.error('postSuccessToast element not found');
    }
    if (!this.postErrorToast) {
      console.error('postErrorToast element not found');
    }
  }

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

    this.http.post('https://swim-api-production-1a4b.up.railway.app/Swim/post/create', postRequest, { headers, withCredentials: true })
      .subscribe(response => {
        console.log('Post created:', response);
        modal.close();
        this.showSuccessToast();
      }, error => {
        console.error('Error creating post:', error);
        this.showErrorToast();
      });
  }

  showSuccessToast() {
    if (this.postSuccessToast) {
      const toast = new Toast(this.postSuccessToast.nativeElement);
      toast.show();
    } else {
      console.error('postSuccessToast element not found');
    }
  }

  showErrorToast() {
    if (this.postErrorToast) {
      const toast = new Toast(this.postErrorToast.nativeElement);
      toast.show();
    } else {
      console.error('postErrorToast element not found');
    }
  }
}
