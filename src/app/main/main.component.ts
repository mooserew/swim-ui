import { Component, ViewChild } from '@angular/core';
import { PostCreateModalComponent } from '../post-create-modal/post-create-modal.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  @ViewChild(PostCreateModalComponent) postCreateModal!: PostCreateModalComponent;

  openPostModal() {
    this.postCreateModal.openModal();
  }
}
