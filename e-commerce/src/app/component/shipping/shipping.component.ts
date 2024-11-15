import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { ShippingService } from '../../services/shipping-service/shipping.service';
import { CartService } from '../../services/cart-service/cart.service';
import { Order } from '../../models/orders';
import { CartItem } from '../../models/cartItem';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shippingComponent',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css'],
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule]
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
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      street: ['', Validators.required],
      provinciaDestino: ['', Validators.required],
      cpDestino: ['', Validators.required],
      shippingMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Fetch cart items
    this.cartService.getCarrito().subscribe((cartItems) => {
      this.products = cartItems;
    });

    // Check if user is logged in and pre-fill email if they are
    this.userService.getUser().subscribe((users) => {
      const currentUser = users.find((user) => user.email);
      if (currentUser) {
        this.isLoggedIn = true;
        this.userEmail = currentUser.email;
        this.shippingForm.controls['email'].setValue(this.userEmail);
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  saveShippingData() {
    if (this.shippingForm.valid) {
      const orderData: Order = {
        products: this.products,  // Use CartItem here
        date: new Date(),
        recipientName: this.shippingForm.value.recipientName,
        recipientSurname: this.shippingForm.value.recipientSurname,
        street: this.shippingForm.value.street,
        provinciaDestino: this.shippingForm.value.provinciaDestino,
        cpDestino: this.shippingForm.value.cpDestino,
        shippingMethod: this.shippingForm.value.shippingMethod,
        shippingCost: this.getSelectedShippingCost(),
      };

      this.shippingService.setShippingData(orderData);
      console.log('Shipping data saved:', orderData);

      this.formSubmitted.emit(true);
    } else {
      console.log('Form is invalid');
      this.formSubmitted.emit(false);
    }
  }

  getSelectedShippingCost(): number {
    const shippingMethod = this.shippingForm.value.shippingMethod;
    return shippingMethod === 'domicilio' ? 8000 : 6000;
  }
}
