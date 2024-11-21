import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';
import { ProfileUpdateFormComponent } from "../profile-update-form/profile-update-form.component";
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

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
    const currentUserId = localStorage.getItem('currentUserId');
  
    if (currentUserId) {
      this.userService.getCredential(currentUserId).subscribe(credential => {
        if (credential === 'manager' && employee.credential !== 'employee') {
          this.errorMessage = 'Managers solo pueden editar empleados.';
          return;
        }
  
        this.selectedEmployee = employee;
        this.profileForm.patchValue(employee);
        this.isEditing = true;
        this.successMessage = null; // Clear any previous success message
        this.errorMessage = null;  // Clear any previous error message
      });
    }
  }
  
  onSaveChanges(updatedFields: Partial<User>) {
    if (this.selectedEmployee) {
      const updatedEmployee = { ...this.selectedEmployee, ...updatedFields };
  
      this.userService.updateUser(this.selectedEmployee.id, updatedEmployee).subscribe(
        updatedData => {
          console.log('Employee updated:', updatedData);
  
          // Update the local employees array
          const index = this.employees.findIndex(emp => emp.id === this.selectedEmployee!.id);
          if (index > -1) {
            this.employees[index] = updatedData; // Update the specific employee
          }
  
          // Update the filtered list as well
          this.filterEmployees();
  
          this.selectedEmployee = updatedData;
          this.isEditing = false;
          this.successMessage = 'Perfil Modificado Exitosamente!';
        },
        error => {
          console.error('Update error:', error);
          this.errorMessage = 'Error modificando perfil.';
        }
      );
    }
  }
  


 onEdit() {
  if (this.selectedEmployee) {
    const currentUserId = localStorage.getItem('currentUserId');

    if (currentUserId) {
      this.userService.getCredential(currentUserId).subscribe(credential => {
        if (credential === 'manager' && this.selectedEmployee!.credential !== 'employee') {
          this.errorMessage = 'Managers can only edit employee users.';
          return;
        }

        this.isEditing = true;

        if (this.isAllowed) {
          this.profileForm.get('credential')?.enable();
        }
      });
    }
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

  onDelete(userId: string) {
    this.userService
      .deleteUser(userId)
      .pipe(
        tap(() => {
          console.log('Employee eliminado:', userId);
  
          // Update the local arrays to remove the deleted user
          this.employees = this.employees.filter(emp => emp.id !== userId);
          this.filteredEmployees = this.filteredEmployees.filter(emp => emp.id !== userId);
  
          this.selectedEmployee = null; // Clear the selection
          this.successMessage = 'Empleado Eliminado Exitosamente';
        })
      )
      .subscribe({
        error: error => {
          console.error('Delete error:', error);
          this.errorMessage = 'Error al eliminar empleado.';
        },
      });
  }
  
  
  goToRegister() { //Link to register function
    this.router.navigate(['registerEmployee']);
  }



}
