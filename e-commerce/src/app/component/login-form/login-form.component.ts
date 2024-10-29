import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

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
    private http: HttpClient
  ) {
    // Initialize form group with controls for email and password
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

    this.authenticateUser(email!, password!)
      .pipe(
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
      )
      .subscribe();
  }

  private authenticateUser(email: string, password: string): Observable<boolean> {
    return this.http
      .get<any[]>(`http://localhost:3000/users?email=${email}&password=${password}`)
      .pipe(
        map((users) => users.length > 0) 
      );
  }
}
