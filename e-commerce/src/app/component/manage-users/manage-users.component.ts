import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';
import { ProfileUpdateFormComponent } from "../profile-update-form/profile-update-form.component";
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProfileUpdateFormComponent, RouterModule,RouterOutlet],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  isAllowed = false;
  employees: User[] = [];
  selectedEmployee!: User | null;
  isEditing = false;
  profileForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  filterText: string = '';
  filteredEmployees: User[] = [];
  private userSubscription!: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      credential: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.checkPermissions(user);
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadEmployees() {
    this.userService.getUser().subscribe(
      (data) => {
        const currentUserJson = localStorage.getItem('currentUser');

        if (currentUserJson) {
          const currentUser: User = JSON.parse(currentUserJson);

          if (currentUser.credential === 'admin') {
            this.employees = data;
          } else if (currentUser.credential === 'manager') {
            this.employees = data.filter(employee => employee.credential !== 'admin');
          } else {
            this.employees = [];
          }
        } else {
          console.error('No se encontró el usuario actual.');
          this.employees = [];
        }
        this.filteredEmployees = this.employees;
      },
      (error) => console.error('Error cargando empleados:', error)
    );
  }

  checkPermissions(user: User | null) {
    this.isAllowed = user ? (user.credential === 'admin' || user.credential === 'manager') : false;
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter(employee =>
      `${employee.name} ${employee.surname}`.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }

  selectEmployee(employee: User) {
    this.selectedEmployee = employee;
    this.profileForm.patchValue(employee);
    this.isEditing = true;
  }

  onSaveChanges() {
    if (this.selectedEmployee) {
      const updatedFields = {
        name: this.profileForm.value.name,
        surname: this.profileForm.value.surname,
        email: this.profileForm.value.email,
        password: this.profileForm.value.password,
        credential: this.isAllowed ? this.profileForm.value.credential : this.selectedEmployee.credential
      };

      this.userService.updateUser(this.selectedEmployee.id, updatedFields).subscribe(
        (updatedEmployee) => {
          console.log('Employee updated:', updatedEmployee);
          this.selectedEmployee = updatedEmployee;
          this.isEditing = false;
          this.successMessage = 'Profile updated successfully!';
        },
        (error) => {
          console.error('Update error:', error);
          this.errorMessage = 'Error updating profile.';
        }
      );
    }
  }

  onEdit() {
    this.isEditing = true;
    if (this.isAllowed) {
      this.profileForm.get('credential')?.enable();
    }
  }

  onCancel() {
    this.isEditing = false;
    if (this.selectedEmployee) {
      this.profileForm.patchValue(this.selectedEmployee);
    }
    if (this.isAllowed) {
      this.profileForm.get('credential')?.disable();
    }
  }

  onCloseUpdateForm() {
    this.isEditing = false;
    this.selectedEmployee = null;
    this.profileForm.reset();
    this.successMessage = null;
    this.errorMessage = null;
  }

  onDelete() {
    if (this.selectedEmployee) {
      this.userService.deleteUser(this.selectedEmployee.id).subscribe(
        () => {
          console.log('Employee deleted:', this.selectedEmployee);
          this.loadEmployees();
          this.selectedEmployee = null;
          this.successMessage = 'Employee deleted successfully!';
        },
        (error) => {
          console.error('Delete error:', error);
          this.errorMessage = 'Error deleting employee.';
        }
      );
    }
  }
}
