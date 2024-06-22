import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent {
  @Input() user: any;

  constructor(private http: HttpClient, private modalService: NgbModal) {}

  saveChanges() {
    console.log('Saving changes for', this.user);
    this.modalService.dismissAll();
  }
}
