import { Component } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { RegisterFormComponent } from "../../component/register-form/register-form.component";
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-register-employee',
  standalone: true,
  imports: [RegisterComponent, RegisterFormComponent,RouterModule],
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.css'
})
export class RegisterEmployeeComponent {

}
