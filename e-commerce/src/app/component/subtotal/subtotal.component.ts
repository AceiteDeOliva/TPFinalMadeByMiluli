import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../services/cart-service/cart.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CheckoutDataService } from '../../services/checkout-data/checkout-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subtotal',
  templateUrl: './subtotal.component.html',
  imports: [CommonModule],
  styleUrls: ['./subtotal.component.css'],
  standalone: true
})
export class SubtotalComponent implements OnInit {
  @Input() cartSubtotal: number = 0; // Parent component should pass cartSubtotal
  @Output() proceedToPayment = new EventEmitter<void>();
  @Input() path: string = '';

  shippingCost: number = 0;
  totalOrderAmount: number = 0;

  constructor(
    private checkoutDataService: CheckoutDataService,
    private cartService: CartService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    // Fetch cart subtotal if not passed as Input
    if (!this.cartSubtotal) {
      this.cartService.getTotalCompra().subscribe((subtotal) => {
        this.cartSubtotal = subtotal;
        this.calculateTotal();
      });
    } else {
      this.calculateTotal();
    }

    // Fetch the shipping cost from ShippingService
    this.shippingService.getShippingData().subscribe((order) => {
      this.shippingCost = order?.shippingCost || 0;
      this.calculateTotal();
    });
  }

  calculateTotal(): void {
    this.totalOrderAmount = this.cartSubtotal + this.shippingCost;
    this.checkoutDataService.setTotalAmount(this.totalOrderAmount);
  }

  onProceedToPayment() {
    this.proceedToPayment.emit();
  }
}
