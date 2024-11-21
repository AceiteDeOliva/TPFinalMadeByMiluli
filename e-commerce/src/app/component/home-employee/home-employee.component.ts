import { Router, RouterModule } from '@angular/router';
import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from '../../services/category-service/category-service.component';

@Component({
  selector: 'app-home-employee',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home-employee.component.html',
  styleUrl: './home-employee.component.css'
})
export class HomeEmployeeComponent {
  @Output() categorySelected = new EventEmitter<string>();

  constructor(
    private router: Router,
    private categoryService: CategoryService
  ) {}

  onStockClick(category: string): void {

    this.router.navigate(['listCategory']);
  }
}
