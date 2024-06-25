import { Component, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Toast } from 'bootstrap';
import { PostService } from '../services/PostService';

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

  constructor(private modalService: NgbModal, private postService: PostService) {}

  ngAfterViewInit() {
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
    this.postService.createPost(this.postContent).subscribe(response => {
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
