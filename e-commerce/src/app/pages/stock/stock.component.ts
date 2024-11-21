import { Component, Input } from '@angular/core';
import { ProductListComponent } from '../../component/product-list/product-list.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [ProductListComponent,CommonModule,FormsModule,RouterModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {
  searchTerm: number = 0;
}
