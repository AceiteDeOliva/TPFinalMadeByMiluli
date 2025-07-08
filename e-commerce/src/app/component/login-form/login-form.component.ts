import { UserService } from '../../services/user-service/user.service';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';
import { CartService } from '../../services/cart-service/cart.service';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites-service/favorites.service';


@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  redirectTo: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,

  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }



  //Autentica al usuario, sincroniza el carrito de invitado y redirige según su rol.

  ngOnInit() {
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
  }

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

        this.cartService.syncGuestCart(user.id).pipe(
          switchMap(() => this.favoritesService.syncGuestFavorites(user.id))
        ).subscribe({
          next: () => {
            console.log('Guest cart and favorites synced successfully!');

            if (this.redirectTo) {
              this.router.navigate([this.redirectTo]);
            } else if (user.credential === 'user') {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/homeEmployee']);
            }
          },
          error: (error) => {
            console.error('Error syncing guest data:', error);
          }
        });
      } else {
        this.errorMessage = 'Mail o Contraseña incorrecto. Intentelo nuevamente';
      }
    });
  }


}
