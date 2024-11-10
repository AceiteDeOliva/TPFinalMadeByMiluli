import { Component } from '@angular/core';
import { ProductListActiveComponent } from "../../component/product-list-active/product-list-active.component";

@Component({
  selector: 'app-active-product-pages',
  standalone: true,
  imports: [ProductListActiveComponent],
  templateUrl: './active-product-pages.component.html',
  styleUrl: './active-product-pages.component.css'
})
export class ActiveProductPagesComponent {

}
