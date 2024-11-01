import { Component, Input, Output, EventEmitter } from '@angular/core';
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
export class ProfileUpdateFormComponent {
  @Input() userData!: User;
  @Input() isAdmin = false;
  @Output() saveChanges = new EventEmitter<Partial<User>>();

  profileForm: FormGroup;
  isEditing = false;

  
  constructor(private formBuilder: FormBuilder) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password:['',[Validators.required]],
      credential: [{ value: '', disabled: true }],
    });
  }

  ngOnInit() {
    if (this.userData) {
      this.profileForm.patchValue(this.userData);

      if (this.isAdmin) {
        this.profileForm.get('credential')?.enable(); // Enable the credential field
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
    this.profileForm.patchValue(this.userData); 
  }
}
