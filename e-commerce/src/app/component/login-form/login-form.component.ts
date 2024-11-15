import { UserService } from '../../services/user-service/user.service';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';
import { CartService } from '../../services/cart-service/cart.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private cartService: CartService  // Inject CartService here
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const { email, password } = this.loginForm.value;

    this.userService.authenticateUser(email, password).subscribe(user => {
      if (user) {
        
        localStorage.setItem('currentUserId', user.id);
        this.authService.changeCredential(user.credential);

        // Sync guest cart to the user's cart after successful login
        this.cartService.syncGuestCart(user.id).subscribe(
          () => {
            console.log('Guest cart synced successfully!');
            // Redirect to home after syncing the cart
            if(user.credential=== 'user'){
              this.router.navigate(['/home']);
            }else {
              this.router.navigate(['/homeEmployee']);
            }

          },
          error => {
            console.error('Error syncing guest cart:', error);
            // Handle error if syncing fails
            alert('There was an error syncing your cart.');
          }
        );
      } else {
        alert('Invalid credentials. Please try again.');
      }
    });
  }

}
