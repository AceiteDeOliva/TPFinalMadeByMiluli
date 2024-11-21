import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';
import { ProfileUpdateFormComponent } from '../../component/profile-update-form/profile-update-form.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  standalone: true,
  imports: [ProfileUpdateFormComponent] 
})
export class ProfilePageComponent implements OnInit {
  userData!: User;
  isAdmin = false;


  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.userData = user;
          this.isAdmin = user.credential === 'admin';
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
    } else {
      console.error('No user ID found in localStorage');
    }
  }


onSaveChanges(updatedUser: Partial<User>) {
  this.userService.updateUser(this.userData.id, updatedUser).subscribe({
    next: (updated) => {
      console.log('User updated:', updated);
      this.userData = { ...this.userData, ...updated };
      alert('User updated successfully!');
    },
    error: (error) => {
      console.error('Update error:', error);
      alert('Error updating user. Please try again.');
    }
  });
}

}
