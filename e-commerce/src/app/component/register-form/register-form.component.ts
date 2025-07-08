import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../services/user-service/user.service';
import { CartService } from '../../services/cart-service/cart.service';
import { FavoritesService } from '../../services/favorites-service/favorites.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' = 'error';
  isLoading = false;
  redirectTo: string | null = null;
  availableCredentials: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {
    this.registerForm = this.formBuilder.group({
      name:[''],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password2: ['', [Validators.required]],
      credential: ['user']
    });
  }

  ngOnInit() {
    this.redirectTo = this.route.snapshot.queryParamMap.get('redirectTo');
  }

  register() {
  if (this.registerForm.invalid) {
    this.message = 'Por favor completa todos los campos.';
    this.messageType = 'error';
    return;
  }

  const { name, surname, email, password, password2, credential } = this.registerForm.value;

  if (password !== password2) {
    this.message = 'Las contraseñas no coinciden.';
    this.messageType = 'error';
    return;
  }

  this.isLoading = true;

  this.userService
    .register(name, surname, email, password, credential)
    .pipe(
      switchMap((newUser) => {
        if (!newUser) {
          this.isLoading = false;
          this.message = 'El usuario ya existe.';
          this.messageType = 'error';
          return of(null);
        }

        // Set current user ID and role
        localStorage.setItem('currentUserId', newUser.id);
        this.authService.changeCredential(newUser.credential);

        // Sync guest data
        return this.cartService.syncGuestCart(newUser.id).pipe(
          switchMap(() => this.favoritesService.syncGuestFavorites(newUser.id)),
          map(() => newUser)
        );
      }),
      tap((user) => {
        this.isLoading = false;

        if (user) {
          this.message = 'Registro exitoso!';
          this.messageType = 'success';

          if (this.redirectTo) {
            this.router.navigate([this.redirectTo]);
          } else if (user.credential === 'user') {
            this.router.navigate(['/home']);
          } else {
            this.router.navigate(['/homeEmployee']);
          }
        }
      }),
      catchError((error) => {
        this.isLoading = false;
        console.error('Error en registro y login:', error);
        this.message = 'Ocurrió un error, inténtelo nuevamente.';
        this.messageType = 'error';
        return of(null);
      })
    )
    .subscribe();
}

}
