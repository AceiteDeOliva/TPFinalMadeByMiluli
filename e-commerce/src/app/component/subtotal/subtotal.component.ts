import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { CartService } from '../../services/cart-service/cart.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CheckoutDataService } from '../../services/checkout-data/checkout-data.service';
import { CommonModule } from '@angular/common';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-subtotal',
  templateUrl: './subtotal.component.html',
  imports: [CommonModule],
  styleUrls: ['./subtotal.component.css'],
  standalone: true
})
export class SubtotalComponent implements OnInit {
  @Output() proceedToPayment = new EventEmitter<void>();
  @Input() path: string = '';
  @Input() inCheckout: boolean = false;
  

  totalOrderAmount$!: Observable<number>;
  shippingCost$!: Observable<number>;
  cartSubtotal$!: Observable<number>;

  constructor(
    private checkoutDataService: CheckoutDataService,
    private cartService: CartService,
    private shippingService: ShippingService
  ) {}

  ngOnInit(): void {
    this.cartSubtotal$ = this.cartService.getSubtotal();
    this.shippingCost$ = this.shippingService.getShippingData().pipe(
      map(data => data?.shippingCost || 0)
    );

    this.totalOrderAmount$ = combineLatest([
      this.cartSubtotal$,
      this.shippingCost$
    ]).pipe(
      map(([subtotal, shipping]) => {
        const total = subtotal + shipping;
        this.checkoutDataService.setShippingCost(shipping);
        this.checkoutDataService.setTotalAmount(total);
        return total;
      })
    );
  }

  onProceedToPayment(): void {
    this.proceedToPayment.emit();
  }
}
