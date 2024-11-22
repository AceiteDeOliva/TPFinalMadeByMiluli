import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user-service/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})

export class RegisterFormComponent {
  registerForm: FormGroup;
  availableCredentials: string[] = [];
  credential:string = '';
  message: string = '';
messageType: 'success' | 'error' = 'error';
isLoading = false;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
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
    this.setAvailableCredentials();
  }

  private setAvailableCredentials() {
    const currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId) {
      this.userService.getCredential(currentUserId).subscribe(credential => {
        this.credential = credential;

        if (credential === 'admin') {
          this.availableCredentials = ['user', 'employee', 'manager', 'admin'];
        } else if (credential === 'manager') {
          this.availableCredentials = ['user', 'employee', 'manager'];
        } else {
          this.availableCredentials = [];
        }
      });
    }
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
        tap((isRegistered) => {
          this.isLoading = false;
          if (isRegistered) {
            this.message = 'Registro exitoso!';
            this.messageType = 'success';
            const route = credential === 'user' || !credential ? '/login' : '/manageUsers';
            this.router.navigate([route]);
          } else {
            this.message = 'El usuario ya existe.';
            this.messageType = 'error';
          }
        }),
        catchError((error) => {
          this.isLoading = false;
          console.error('Registration error', error);
          this.message = 'ocurrio un erro,intentelo nuevamente.';
          this.messageType = 'error';
          return of(false);
        })
      )
      .subscribe();
  }


}
