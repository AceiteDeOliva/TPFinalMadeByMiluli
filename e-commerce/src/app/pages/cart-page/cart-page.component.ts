import { Component } from '@angular/core';
import { CartComponent } from "../../component/cart/cart.component";
import { SubtotalComponent } from "../../component/subtotal/subtotal.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CartComponent, SubtotalComponent, CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent {

  cartSubtotal: number = 0;
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check if the user is logged in by checking localStorage or using a service
    const currentUser = localStorage.getItem('currentUserId');
    this.isLoggedIn = !!currentUser; // Set to true if user is logged in, false otherwise
  }

  onSubtotalChanged(subtotal: number): void {
    this.cartSubtotal = subtotal;
  }

  onProceedToPayment(): void {
    if (this.isLoggedIn) {
      // Navigate to the shipping info page if logged in
      this.router.navigate(['shippingInfo']);
    } else {
      // Navigate to the login page if not logged in
      this.router.navigate(['loginForOrder']);
    }
  }
}

