import { RouterModule, RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { ProductListComponent } from '../product-list/product-list.component';
import { FormsModule, } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css'],
  standalone: true,
  imports: [ProductListComponent, FormsModule,RouterModule,CommonModule]
})
export class ManageProductsComponent {
  searchTerm: string = '';

}
