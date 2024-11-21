import { ProductService } from './../../services/product-service/product.service';
import { forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { ShippingService } from '../../services/shipping-service/shipping.service';


@Component({
  selector: 'app-list-orders',
  templateUrl: './list-orders.component.html',
  styleUrls: ['./list-orders.component.css']
})
export class ListOrdersComponent implements OnInit {

  shippingData: any = {};
  cartProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.getShippingData();
  }


  getShippingData(): void {
    this.shippingService.getShippingData().subscribe((data) => {
      this.shippingData = data;

      console.log("Productos en el carrito:", this.shippingData.products);


      if (this.shippingData.products && this.shippingData.products.length > 0) {
        this.getProductsFromCart(this.shippingData.products);
      }
    });
  }


  getProductsFromCart(cart: any[]): void {
    const productRequests = cart.map(item => {
      return this.productService.fetchProductWithImageByUrl(item.productUrl).pipe(
        map(({ details, productUrl }) => {
          if (details) {

            return {
              ...details,
              quantity: item.quantity
            };
          }


          console.warn(`Product not found for ${productUrl}`);
          return null;
        })
      );
    });


    forkJoin(productRequests).subscribe((products) => {

      this.cartProducts = products.filter(product => product !== null);
      console.log('Productos en el carrito:', this.cartProducts);
    });
  }
}
