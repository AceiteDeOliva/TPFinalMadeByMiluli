import { Component, EventEmitter } from '@angular/core';
import { CartComponent } from "../../component/cart/cart.component";
import { SubtotalComponent } from "../../component/subtotal/subtotal.component";
import { CartService } from '../../services/cart-service/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CartComponent, SubtotalComponent,CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {

  cartSubtotal: number = 0;
  cartLenght: number =0;
  isEmpty:boolean=false


  onSubtotalChanged(subtotal: number): void {
    this.cartSubtotal=subtotal;

  }



}
