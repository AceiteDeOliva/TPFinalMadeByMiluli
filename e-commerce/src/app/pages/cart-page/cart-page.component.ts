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

    const currentUser = localStorage.getItem('currentUserId');
    this.isLoggedIn = !!currentUser;
  }

  onSubtotalChanged(subtotal: number): void {
    this.cartSubtotal = subtotal;
  }

  onProceedToPayment(): void {
    if (this.isLoggedIn) {

      this.router.navigate(['shippingInfo']);
    } else {
  
      this.router.navigate(['loginForOrder']);
    }
  }
}

