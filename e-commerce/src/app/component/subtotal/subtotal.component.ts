import { Component, Input, input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service/cart.service';  // Import CartService
import { ShippingService } from '../../services/shipping-service/shipping-service.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subtotal',
  templateUrl: './subtotal.component.html',
  imports:[RouterModule,CommonModule],
  styleUrls: ['./subtotal.component.css'],
  standalone: true
})
export class SubtotalComponent implements OnInit {
  @Input() path: string = '';
  @Input() cartSubtotal: number = 0;

  shippingCost: number = 0;
  totalOrderAmount: number = 0;

  constructor(
    private cartService: CartService,
    private shippingService: ShippingService,
    private router:Router
  ) {}

  ngOnInit(): void {
    // Fetch cart subtotal from the cart service
    this.cartService.getTotalCompra().subscribe((subtotal) => {
      this.cartSubtotal = subtotal;
      this.calculateTotal();  // Recalculate total whenever subtotal is updated
    });

    // Fetch the shipping cost from ShippingService
    this.shippingService.getShippingCost().subscribe((shippingCost) => {
      this.shippingCost = shippingCost;
      this.calculateTotal();  // Recalculate total whenever shipping cost changes
    });
  }

  // Calculate the total order amount (subtotal + shipping cost)
  calculateTotal(): void {
    this.totalOrderAmount = this.cartSubtotal + this.shippingCost;
  }
  goToPayment() { //Link to register function
    this.router.navigate([this.path]);
  }
}
