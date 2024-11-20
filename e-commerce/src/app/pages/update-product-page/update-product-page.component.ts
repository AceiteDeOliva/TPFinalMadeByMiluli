import { Component } from '@angular/core';
import { ProductUpdateFormComponent } from "../../component/product-update-form/product-update-form.component";
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-update-product-page',
  standalone: true,
  imports: [ProductUpdateFormComponent,RouterModule],
  templateUrl: './update-product-page.component.html',
  styleUrl: './update-product-page.component.css'
})
export class UpdateProductPageComponent {

}
