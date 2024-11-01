import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service'; 
import { User } from '../../models/user';
import { ProfileUpdateFormComponent } from '../../component/profile-update-form/profile-update-form.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [ProfileUpdateFormComponent] // Add the form component here
})

export class ProfilePageComponent implements OnInit {
  userData!: User;
  isAdmin = false;

  constructor(private userService: UserService) { }


  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userData = user; 
    this.isAdmin = user.credential === 'admin'; 
  }

  onSaveChanges(updatedUser: Partial<User>) {
    this.userService.updateUser(this.userData.id, updatedUser).subscribe(
      (updated) => {
        console.log('User updated:', updated);
        this.userData = { ...this.userData, ...updated }; 
      },
      (error) => console.error('Update error:', error)
    );
  }
}
