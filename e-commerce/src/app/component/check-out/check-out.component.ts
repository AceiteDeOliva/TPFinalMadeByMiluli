import { UserService } from '../../services/user-service/user.service';
import { Component, OnInit } from '@angular/core';
import { MercadopagoService } from '../../services/mercadopago-service/mercadopago.service';
import { CheckoutDataService } from '../../services/checkout-data/checkout-data.service';
import { lastValueFrom, forkJoin } from 'rxjs';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { Order } from '../../models/orders';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service/product.service';
import { Product } from '../../models/product';
import { map } from 'rxjs';



declare var MercadoPago: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './check-out.component.html',
  standalone: true,
  styleUrls: ['./check-out.component.css'],
  imports: [CommonModule],
})
export class CheckoutComponent implements OnInit {
  total: number = 0;
  shippingData: any;
  products: Product[] = [];
  cartProducts: Product[] = [];



  constructor(
    private mpService: MercadopagoService,
    private checkoutDataService: CheckoutDataService,
    private shippingService: ShippingService,
    private userService: UserService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {

    this.checkoutDataService.getTotalAmount().subscribe((amount) => {
      this.total = amount;
    });

    this.getShippingData();
    const mp = new MercadoPago('APP_USR-45356463-6ac7-49ed-a858-abeea75d9906', { locale: 'es-AR' });
    const orderData = {
      title: 'Compra en Made by Miluli',
      quantity: 1,
      price: this.total,
    };
    this.createPreferenceAndButton(mp, orderData);
    


  }



  getShippingData(): void {
    this.shippingService.getShippingData().subscribe((data) => {
      this.shippingData = data;

      console.log("productos en el carriot" + this.shippingData.Products)
      if (this.shippingData.products && this.shippingData.products.length > 0) {
        this.getProductsFromCart(this.shippingData.products);
      }
    });
  }
  getProductsFromCart(cart: any[]): void {
    const productRequests = cart.map(item => {
      return this.productService.fetchProductWithImageByUrl(item.productUrl).pipe(
        map(({ details }) => {
          if (details) {
            return {
              ...details,
              quantity: item.quantity
            };
          }

          console.warn(`Product not found for ${item.productUrl}`);
          return null;
        })
      );
    });

    forkJoin(productRequests).subscribe((products) => {

      this.cartProducts = products.filter(product => product !== null);
      console.log('Cart products with quantities:', this.cartProducts);
    });
  }




  async createPreferenceAndButton(mp: any, orderData: any) {
    try {
      const response = await lastValueFrom(this.mpService.createPreference(orderData));
      this.createCheckoutButton(mp, response.id);
    } catch (error) {
      console.error('Error creating preference:', error);
      alert('Error al crear preferencia');
    }
  }

  createCheckoutButton(mp: any, preferenceId: string) {
    const brickBuilder = mp.bricks();
    brickBuilder.create('wallet', 'wallet_container', {
      initialization: { preferenceId: preferenceId },
    }).catch((err: any) => {
      console.error('Error creating checkout button', err);
    });
  }


  onPaymentSuccess() {

    this.shippingService.getShippingData().subscribe((order: Order | null) => {
      if (order) {

        const userId = localStorage.getItem('currentUserId');

        if (userId) {

          this.userService.addOrderToPurchaseHistory(userId, order).subscribe(() => {
            console.log('Order saved to purchase history');
          });
        }
      }
    });
  }
}
