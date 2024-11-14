import { Component, EventEmitter } from '@angular/core';
import { CartComponent } from "../../component/cart/cart.component";
import { SubtotalComponent } from "../../component/subtotal/subtotal.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CartComponent, SubtotalComponent,CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {

  cartSubtotal: number = 0;

  constructor(private router: Router) {}

  onSubtotalChanged(subtotal: number): void {
    this.cartSubtotal=subtotal;

  }


  onProceedToPayment(): void {
    this.router.navigate(['shippingInfo']);
  }

}
