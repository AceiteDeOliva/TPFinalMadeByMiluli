import { ProductService } from './../../services/product-service/product.service';
import { Component } from '@angular/core';
import { ProductListComponent } from "../../component/product-list/product-list.component";
import { Product } from '../../models/product';
import { FormGroup,FormBuilder, ReactiveFormsModule,Validators} from '@angular/forms';
import { ManageProductsComponent } from '../../component/manage-products/manage-products.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-manage-product-page',
  standalone: true,
  imports: [ReactiveFormsModule,ManageProductsComponent,RouterModule],
  templateUrl: './manage-product-page.component.html',
  styleUrl: './manage-product-page.component.css'
})
export class ManageProductPageComponent {


  
 

}
