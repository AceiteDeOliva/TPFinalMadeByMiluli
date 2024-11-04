import { Component } from '@angular/core';
import { ManageUsersComponent } from '../../component/manage-users/manage-users.component';

@Component({
  selector: 'app-manage-users-page',
  standalone: true,
  imports: [ManageUsersComponent],
  templateUrl: './manage-users-page.component.html',
  styleUrl: './manage-users-page.component.css'
})
export class ManageUsersPageComponent {

}
