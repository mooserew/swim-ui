import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent implements OnInit {
  @Input() user: any;
  @Output() bioUpdated = new EventEmitter<string>();
  private baseUrl = 'https://swim-api-production-1a4b.up.railway.app';
  profileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    public modal: NgbActiveModal
  ) {
    this.profileForm = this.formBuilder.group({
      bio: ['']  // Initialize with empty value or default bio if available
    });
  }

  ngOnInit() {
    if (this.user && this.user.bio) {
      this.profileForm.patchValue({
        bio: this.user.bio
      });
    }
  }

  saveChanges() {
    const newBio = this.profileForm.get('bio')?.value;
    const params = new HttpParams().set('newBio', newBio);

    this.http.put(`${this.baseUrl}/user/edit-profile`, {}, { params, responseType: 'text', withCredentials: true })
      .subscribe(
        (response: any) => {
          console.log('Profile updated successfully:', response);
          this.bioUpdated.emit(newBio);  // Emit the updated bio
          this.modal.close('Profile updated');
        },
        (error: any) => {
          console.error('Error updating profile:', error);
        }
      );
  }
}
