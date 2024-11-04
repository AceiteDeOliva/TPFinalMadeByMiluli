import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { User } from '../../models/user';
import { ProfileUpdateFormComponent } from "../profile-update-form/profile-update-form.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProfileUpdateFormComponent,RouterModule],
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  isAllowed = false; // Propiedad para verificar permisos
  employees: User[] = [];
  selectedEmployee!: User | null;
  isEditing = false;
  profileForm: FormGroup;
  successMessage: string | null = null; // Para guardar mensajes de éxito
  errorMessage: string | null = null; // Para guardar mensajes de error
  filterText: string = ''; // Propiedad para filtrar empleados
  filteredEmployees: User[] = []; // Lista de empleados filtrados

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      credential: ['', Validators.required], // Habilitar credencial por defecto
    });
  }

  ngOnInit() {
    this.loadEmployees();
    this.checkPermissions(); // Verificar permisos al iniciar
  }

  loadEmployees() {
    this.userService.getUser().subscribe(
      (data) => {
        const currentUserJson = localStorage.getItem('currentUser');

        if (currentUserJson) {
          const currentUser: User = JSON.parse(currentUserJson);

          // Verificar si el usuario actual es un administrador o un gerente
          if (currentUser.credential === 'admin') {
            // Mostrar todos los empleados y gerentes para el administrador
            this.employees = data; // Suponiendo que 'data' incluye empleados y gerentes
          } else if (currentUser.credential === 'manager') {
            // Mostrar solo empleados para el gerente
            this.employees = data.filter(employee => employee.credential !== 'admin');
          } else {
            // Limpiar la lista si el usuario no es ni administrador ni gerente
            this.employees = []; // O manejar según sea necesario
          }
        } else {
          console.error('No se encontró el usuario actual.');
          this.employees = []; // No hay usuarios disponibles si no hay usuario actual
        }
        this.filteredEmployees = this.employees; // Inicializar la lista filtrada
      },
      (error) => console.error('Error cargando empleados:', error)
    );
  }

  checkPermissions() {
    const currentUserJson = localStorage.getItem('currentUser');
    
    if (currentUserJson) {
      const currentUser: User = JSON.parse(currentUserJson);
      this.isAllowed = currentUser.credential === 'admin' || currentUser.credential === 'manager';
    } else {
      this.isAllowed = false; // Por defecto, falso si no se encuentra usuario
    }
  }

  // Método para filtrar empleados
  filterEmployees() {
    this.filteredEmployees = this.employees.filter(employee =>
      `${employee.name} ${employee.surname}`.toLowerCase().includes(this.filterText.toLowerCase())
    );
  }
  selectEmployee(employee: User) {
    this.selectedEmployee = employee;
    this.profileForm.patchValue(employee);
    this.isEditing = true; // Set isEditing to true to show the update form
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
          this.successMessage = 'Profile updated successfully!'; // Set success message
        },
        (error) => {
          console.error('Update error:', error);
          this.errorMessage = 'Error updating profile.'; // Set error message
        }
      );
    }
  }

  onEdit() {
    this.isEditing = true;
    if (this.isAllowed) {
      this.profileForm.get('credential')?.enable(); // Enable credential field
    }
  }

  onCancel() {
    this.isEditing = false;
    if (this.selectedEmployee) {
      this.profileForm.patchValue(this.selectedEmployee);
    }
    if (this.isAllowed) {
      this.profileForm.get('credential')?.disable(); // Disable credential field
    }
  }

  onCloseUpdateForm() {
    this.isEditing = false; // Hide the editing mode
    this.selectedEmployee = null; // Clear the selected employee
    this.profileForm.reset(); // Reset the form
    this.successMessage = null; // Reset success message
    this.errorMessage = null; // Reset error message
  }

  onDelete() {
    if (this.selectedEmployee) {
      this.userService.deleteUser(this.selectedEmployee.id).subscribe(
        () => {
          console.log('Employee deleted:', this.selectedEmployee);
          this.loadEmployees(); // Reload the employee list after deletion
          this.selectedEmployee = null; // Clear selection
          this.successMessage = 'Employee deleted successfully!'; // Set success message
        },
        (error) => {
          console.error('Delete error:', error);
          this.errorMessage = 'Error deleting employee.'; // Set error message
        }
      );
    }
  }
}