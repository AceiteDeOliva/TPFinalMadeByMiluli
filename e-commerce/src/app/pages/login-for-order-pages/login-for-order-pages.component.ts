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
  continueAsGuest: boolean = false;

  constructor(private router: Router) {}


  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }


  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

 
  continueAsGuestPage(): void {
    this.router.navigate(['/shippingInfo']);
  }
}
