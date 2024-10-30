import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

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
      password2: ['', [Validators.required]]
    });
  }

  register() {

    if (this.registerForm.invalid) { // checks if all fields are filled
      alert('Please fill in all required fields.');
      return;
    }

    const { email, password, password2 } = this.registerForm.value;

    if (password !== password2) { //checks if passwords match
      alert('Passwords do not match.');
      return;
    }

    this.checkUserExists(email!)
      .pipe(
        switchMap((exists) => {
          if (exists) {
            alert('User with this email already exists.');
            this.router.navigate(['/login']); //sends to log in if user already exists
            return of(false); // Stops further processing if user exists
          } else {
            return this.createUser(email!, password!); //creates user
          }
        }),
        tap((isCreated) => {
          if (isCreated) {
            alert('Registration successful!');
            this.router.navigate(['/login']);
          } else if (isCreated === false) {
            alert('Registration failed.');
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

  private checkUserExists(email: string): Observable<boolean> { //Checks if user with a certain email already exists
    return this.http
      .get<any[]>(`http://localhost:3000/users?email=${email}`)
      .pipe(
        map((users) => users.length > 0)
      );
  }

  private createUser(email: string, password: string): Observable<boolean> { //creates json object in the json DB
    
    const newUser = {
      email,
      password,
      cart: [], 
      purchaseHistory: [],
      credential: "user"
    };

    return this.http
      .post<any>(`http://localhost:3000/users`, { newUser})
      .pipe(
        map((user) => !!user)
      );
  }
}
