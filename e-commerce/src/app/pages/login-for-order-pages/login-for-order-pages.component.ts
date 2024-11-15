import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-for-order-pages',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-for-order-pages.component.html',
  styleUrls: ['./login-for-order-pages.component.css']
})
export class LoginForOrderPagesComponent {
  continueAsGuest: boolean = false; // Default is not continuing as guest

  constructor(private router: Router) {}

  // Navigate to the login page
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Navigate to the register page
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Continue as guest, navigate to shipping info page
  continueAsGuestPage(): void {
    this.router.navigate(['/shippingInfo']);
  }
}
