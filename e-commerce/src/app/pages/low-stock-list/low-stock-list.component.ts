import { Component } from '@angular/core';
import { ProductListComponent } from "../../component/product-list/product-list.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-low-stock-list',
  standalone: true,
  imports: [ProductListComponent,RouterModule],
  templateUrl: './low-stock-list.component.html',
  styleUrl: './low-stock-list.component.css'
})
export class LowStockListComponent {

}
