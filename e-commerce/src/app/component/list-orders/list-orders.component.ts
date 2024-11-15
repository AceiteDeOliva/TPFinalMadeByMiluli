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

  shippingData: any = {}; // Define appropriate structure for shippingData
  cartProducts: any[] = []; // Array to hold processed cart products

  constructor(
    private productService: ProductService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.getShippingData(); // Initialize shipping data fetch
  }

  // Obtén los datos de envío
  getShippingData(): void {
    this.shippingService.getShippingData().subscribe((data) => {
      this.shippingData = data;

      console.log("Productos en el carrito:", this.shippingData.products); // Log products in the cart

      // Check if there are products in the cart and process them
      if (this.shippingData.products && this.shippingData.products.length > 0) {
        this.getProductsFromCart(this.shippingData.products); // Call to process the products
      }
    });
  }

  // Process products from the cart
  getProductsFromCart(cart: any[]): void {
    const productRequests = cart.map(item => {
      return this.productService.fetchProductWithImageByUrl(item.productUrl).pipe(
        map(({ details, productUrl }) => {
          if (details) {
            // Return product details along with quantity from the cart
            return {
              ...details,
              quantity: item.quantity // Add quantity from the cart
            };
          }

          // If product is not found, log a warning and return null
          console.warn(`Product not found for ${productUrl}`);
          return null;
        })
      );
    });

    // Combine all product observables and subscribe to them
    forkJoin(productRequests).subscribe((products) => {
      // Filter out any null values (products not found)
      this.cartProducts = products.filter(product => product !== null);
      console.log('Productos en el carrito:', this.cartProducts); // Log the processed cart products
    });
  }
}
