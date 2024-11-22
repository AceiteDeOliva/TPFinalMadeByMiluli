import { UserService } from '../../services/user-service/user.service';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';
import { CartService } from '../../services/cart-service/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }



//Autentica al usuario, sincroniza el carrito de invitado y redirige según su rol.

login() {
  if (this.loginForm.invalid) {
    this.errorMessage = 'Porfavor complete todo los campos.';
    return;
  }

  const { email, password } = this.loginForm.value;

  this.userService.authenticateUser(email, password).subscribe(user => {
    if (user) {
      localStorage.setItem('currentUserId', user.id);
      this.authService.changeCredential(user.credential);

      this.cartService.syncGuestCart(user.id).subscribe(
        () => {
          console.log('Guest cart synced successfully!');

          if (user.credential === 'user') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/homeEmployee']);
          }
        },
        error => {
          console.error('Error syncing guest cart:', error);
        }
      );
    } else {
      this.errorMessage = 'Mail o Contraseña incorrecto.Intentelo nuevamente';
    }
  });
}


}
