import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CartService } from '../../services/cart-service/cart.service';
import { CartItem } from '../../models/cartItem';
import { CommonModule } from '@angular/common';
import { Order } from '../../models/orders';

@Component({
  selector: 'app-shippingComponent',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ShippingComponent implements OnInit {
  shippingForm: FormGroup;
  isLoggedIn: boolean = false;
  userEmail: string = '';
  products: CartItem[] = [];

  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private shippingService: ShippingService,
    private cartService: CartService
  ) {
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      recipientSurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      street: ['', Validators.required],
      provinciaDestino: ['', Validators.required],
      cpDestino: ['', Validators.required],
      shippingMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {


    this.cartService.getCarrito().subscribe((cartItems) => {
      this.products = cartItems;
    });


    const currentUserId = localStorage.getItem('currentUserId');

    if (currentUserId) {
      this.userService.getUserById(currentUserId).subscribe((currentUser) => {
        if (currentUser) {
          this.isLoggedIn = true;
          this.userEmail = currentUser.email;

          this.shippingForm.controls['email'].setValue(this.userEmail);
          this.shippingForm.controls['email'].disable();
        } else {
          this.isLoggedIn = false;
          this.shippingForm.controls['email'].enable();
        }
      }, (error) => {
        console.error('Error fetching user:', error);
        this.isLoggedIn = false;
        this.shippingForm.controls['email'].enable();
      });
    } else {
      this.isLoggedIn = false;
      this.shippingForm.controls['email'].enable();
    }

  }

  saveShippingData(): void {
    if (this.shippingForm.valid) {
      const orderData: Order = {

        products: this.products,  

        date: new Date(),
        recipientName: this.shippingForm.value.recipientName,
        recipientSurname: this.shippingForm.value.recipientSurname,
        street: this.shippingForm.value.street,
        provinciaDestino: this.shippingForm.value.provinciaDestino,
        cpDestino: this.shippingForm.value.cpDestino,
        shippingMethod: this.shippingForm.value.shippingMethod,
        shippingCost: this.shippingCost,
        totalCost: this.cartSubtotal + this.shippingCost 
      };

      this.shippingService.setShippingData(orderData);
      console.log('Shipping data saved:', orderData);

      this.formSubmitted.emit(true);
    } else {
      console.log('Form is invalid');
      this.formSubmitted.emit(false);
    }
  }

  private fetchCartSubtotal(): void {
    this.cartService.getTotalCompra().subscribe({
      next: (subtotal) => {
        this.cartSubtotal = subtotal; 
        this.updateShippingCost(); 
      },
      error: () => {
        console.error('Error fetching cart subtotal');
      }
    });
  }

  private updateShippingCost(): void {
    const shippingMethod = this.shippingForm.value.shippingMethod;
    this.shippingCost = shippingMethod === 'domicilio' ? 8000 : 6000;
  }
}
