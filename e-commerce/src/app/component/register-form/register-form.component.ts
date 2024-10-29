import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})


export class RegisterFormComponent {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  register() {
    if (this.registerForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const { email, password } = this.registerForm.value;

    this.createUser(email!, password!)
      .pipe(
        tap((isCreated) => {
          if (isCreated) {
            alert('Registration successful!');
            this.router.navigate(['/login']);
          } else {
            alert('Registration failed. Email might already be in use.');
          }
        }),
        catchError((error) => {
          console.error('Registration error', error);
          alert('An error occurred while registering.');
          return of(false);
        })
      )
      .subscribe();
  }

  private createUser(email: string, password: string): Observable<boolean> {
    return this.http
      .post<any>(`http://localhost:3000/users`, { email, password })
      .pipe(
        map((user) => user ? true : false) // Return true if the user was created successfully
      );
  }
}
