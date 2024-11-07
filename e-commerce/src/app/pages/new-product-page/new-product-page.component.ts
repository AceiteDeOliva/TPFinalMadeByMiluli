import { Component } from '@angular/core';
import { ProductFormComponent } from "../../component/product-form/product-form.component";
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-new-product-page',
  standalone: true,
  imports: [ProductFormComponent,RouterModule,RouterOutlet],
  templateUrl: './new-product-page.component.html',
  styleUrl: './new-product-page.component.css'
})
export class NewProductPageComponent {

}
