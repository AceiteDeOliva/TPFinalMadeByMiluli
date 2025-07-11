import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-update-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-update-form.component.html',
  styleUrls: ['./profile-update-form.component.css'] 
})
export class ProfileUpdateFormComponent implements OnInit, OnChanges {
  @Input() userData!: User;
  @Input() isAdmin = false;
  @Output() saveChanges = new EventEmitter<Partial<User>>();
  @Output() deleteProfile = new EventEmitter<string>();


  profileForm: FormGroup;
  isEditing = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService : UserService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      credential: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    this.initializeForm(); 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userData']) {
      this.initializeForm(); 
    }
  }

  private initializeForm() {
    if (this.userData) {
      this.profileForm.patchValue(this.userData);
      console.log('Form values after patch:', this.profileForm.value);

      if (this.isAdmin) {
        this.profileForm.get('credential')?.enable(); 
      } else {
        this.profileForm.get('credential')?.disable(); 
      }
    }
  }

  onEdit() {
    this.isEditing = true; 
  }

  onSave() {
    if (this.profileForm.valid) {
      const updatedUser: Partial<User> = {
        ...this.userData,
        ...this.profileForm.value 
      };
      this.saveChanges.emit(updatedUser); 
      this.isEditing = false; 
    }
  }

  onCancel() {
    this.isEditing = false;
    this.initializeForm(); 
  }

  onDelete() {
    if (this.userData) {
      const confirmed = window.confirm(
        `Are you sure you want to delete the profile of ${this.userData.name}?`
      );
  
      if (confirmed) {
        if (this.deleteProfile.observed) {
          this.deleteProfile.emit(this.userData.id);
        } else {
          this.userService.deleteUser(this.userData.id).subscribe({
            next: () => {
              console.log('Profile deleted successfully.');
              window.location.href = '/home'; 
              localStorage.removeItem('currentUserId');
            },
            error: error => {
              console.error('Error deleting user:', error);
              alert('Error deleting the profile.');
            },
          });
        }
      }
    }
  }
  
  


}
