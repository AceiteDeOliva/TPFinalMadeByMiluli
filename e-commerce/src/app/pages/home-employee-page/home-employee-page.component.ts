import { Component } from '@angular/core';
import { HomeEmployeeComponent } from "../../component/home-employee/home-employee.component";

@Component({
  selector: 'app-home-employee-page',
  standalone: true,
  imports: [HomeEmployeeComponent],
  templateUrl: './home-employee-page.component.html',
  styleUrl: './home-employee-page.component.css'
})
export class HomeEmplyeePageComponent {

}
