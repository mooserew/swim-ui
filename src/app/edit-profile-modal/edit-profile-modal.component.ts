import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrls: ['./edit-profile-modal.component.css']
})
export class EditProfileModalComponent implements OnInit {
  @Input() user: any; // Input property to receive user data from parent component
  profileForm: FormGroup;
  selectedFile: File | null = null;
  @Output() bioUpdated = new EventEmitter<string>();

  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.profileForm = this.fb.group({
      bio: ['']
    });
  }

  ngOnInit(): void {
    if (this.user) {
      this.profileForm.patchValue({
        bio: this.user.bio
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  saveChanges(): void {
    const bio = this.profileForm.get('bio')?.value;

    if (bio && bio.trim() !== '') {
      const bioFormData: FormData = new FormData();
      bioFormData.append('newBio', bio);

      // Update bio
      this.http.put('https://swim-api-production-1a4b.up.railway.app/Swim/user/edit-profile', bioFormData, { withCredentials: true, responseType: 'text' })
        .subscribe(response => {
          console.log('Bio updated successfully', response);
          this.bioUpdated.emit(bio);
          // Optionally handle success, e.g., show a message
        }, (error: HttpErrorResponse) => {
          console.error('Error updating bio', error);
        });
    }

    // Update profile picture if a file is selected
    if (this.selectedFile) {
      const fileFormData: FormData = new FormData();
      fileFormData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post('https://swim-api-production-1a4b.up.railway.app/Swim/user/upload', fileFormData, { withCredentials: true, responseType: 'text' })
        .subscribe(response => {
          console.log('Profile picture updated successfully', response);
          this.modal.close('profileUpdated');
        }, (error: HttpErrorResponse) => {
          console.error('Error updating profile picture', error);
        });
    } else if (!bio || bio.trim() === '') {
      // If no bio and no profile picture, just close the modal
      this.modal.close('noChanges');
    } else {
      this.modal.close('bioUpdated');
    }
  }
}
