import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service/user.service';
import { ShippingService } from '../../services/shipping-service/shipping-service.component';

@Component({
  selector: 'app-shippingComponent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})

export class ShippingComponent implements OnInit {
  shippingForm: FormGroup;
  isLoggedIn: boolean = false;
  userEmail: string = '';

  @Output() formSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(); // EventEmitter for emitting form submit status

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private shippingService: ShippingService
  ) {
    // Initialize form with email field disabled initially
    this.shippingForm = this.fb.group({
      recipientName: ['', Validators.required],
      recipientSurname: ['', Validators.required],
      email: [{value: '', disabled: true}, [Validators.required, Validators.email]],  // Email disabled by default
      street: ['', Validators.required],
      provinciaDestino: ['', Validators.required],
      cpDestino: ['', Validators.required],
      shippingMethod: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Check if user is logged in and pre-fill email if they are
    this.userService.getUser().subscribe((users) => {
      const currentUser = users.find((user) => user.email);
      if (currentUser) {
        this.isLoggedIn = true;
        this.userEmail = currentUser.email;

        // Update email value and disable email field if logged in
        this.shippingForm.controls['email'].setValue(this.userEmail);
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  // Save shipping data to the ShippingService
  saveShippingData() {
    if (this.shippingForm.valid) {
      // Save the form data and selected shipping cost in the service
      const shippingData = this.shippingForm.value;
      const selectedShippingCost = this.getSelectedShippingCost();

      // Use the ShippingService to store the data
      this.shippingService.setShippingData(shippingData);
      this.shippingService.setShippingCost(selectedShippingCost);

      console.log('Shipping data saved:', shippingData);

      // Emit the success status to notify the parent component
      this.formSubmitted.emit(true);
    } else {
      console.log('Form is invalid');

      // Emit false if form is not valid
      this.formSubmitted.emit(false);
    }
  }

  // Method to get the selected shipping cost
  getSelectedShippingCost(): number {
    const shippingMethod = this.shippingForm.value.shippingMethod;

    let shippingCost = 0;
    if (shippingMethod === 'domicilio') {
      shippingCost = 8000;
    } else if (shippingMethod === 'sucursal') {
      shippingCost = 6000;
    }

    return shippingCost;
  }
}
