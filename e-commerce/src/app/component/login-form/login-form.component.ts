import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

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
    private userService: UserService
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
  
      this.userService.authenticateUser(email!, password!).pipe(
        tap((isValid) => {
          if (isValid) {
            alert('Login successful!');
            this.router.navigate(['/home']);
          } else {
            alert('Invalid email or password');
          }
        }),
        catchError((error) => {
          console.error('Login error', error);
          alert('An error occurred while logging in.');
          return of(false);
        })
      ).subscribe();
    }
}
