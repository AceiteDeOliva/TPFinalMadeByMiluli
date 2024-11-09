import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';
import { ProfileUpdateFormComponent } from "../profile-update-form/profile-update-form.component";
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProfileUpdateFormComponent, RouterModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  isAllowed = false;
  employees: User[] = [];
  selectedEmployee!: User | null;
  isEditing = false;
  profileForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  filterText: string = '';
  filteredEmployees: User[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
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
    this.checkPermissions();
  }

  loadEmployees() {
    const currentUserId = localStorage.getItem('currentUserId');

    if (currentUserId) {
      this.userService.getCredential(currentUserId).subscribe(credential => {
        this.isAllowed = credential === 'admin' || credential === 'manager';

        if (this.isAllowed) {
          // Load all employees if admin
          this.userService.getUser().subscribe(data => {
            this.employees = data;
            this.filteredEmployees = this.employees;
          });
        } else {
          // If user is not admin or manager, clear the employee list
          this.employees = [];
          this.filteredEmployees = [];
        }
      });
    } else {
      console.error('No current user ID found in local storage.');
      this.employees = [];
    }
  }

  checkPermissions() {
    const currentUserId = localStorage.getItem('currentUserId');

    if (currentUserId) {
      this.userService.getCredential(currentUserId).subscribe(credential => {
        this.isAllowed = credential === 'admin' || credential === 'manager';
      });
    } else {
      this.isAllowed = false;
    }
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

  onSaveChanges(updatedFields: Partial<User>) {
    if (this.selectedEmployee) {
      // Mezcla los datos actualizados con los actuales de `selectedEmployee`
      const updatedEmployee = { ...this.selectedEmployee, ...updatedFields };
      this.userService.updateUser(this.selectedEmployee.id, updatedEmployee).subscribe(
        updatedData => {
          console.log('Employee updated:', updatedData);
          this.selectedEmployee = updatedData; // Actualiza con los datos realmente guardados
          this.isEditing = false;
          this.successMessage = 'Profile updated successfully!';
        },
        error => {
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
    this.selectedEmployee = null; // Clear selectedEmployee to close the form
    this.profileForm.reset(); // Reset the form fields
    this.successMessage = null;
    this.errorMessage = null;
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
        error => {
          console.error('Delete error:', error);
          this.errorMessage = 'Error deleting employee.';
        }
      );
    }
  }

  goToRegister() { //Link to register function
    this.router.navigate(['register-Employee']);
  }
}
