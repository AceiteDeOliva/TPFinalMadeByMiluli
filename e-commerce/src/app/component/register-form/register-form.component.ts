import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

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
    private userService: UserService
  ) {
    this.registerForm = this.formBuilder.group({
      name:[''],
      surname: [''],
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

    const { name, surname, email, password, password2 } = this.registerForm.value;

    if (password !== password2) { //checks if passwords match
      alert('Passwords do not match.');
      return;
    }


    this.userService.register(name, surname, email, password).pipe(
      tap((isRegistered) => {
        if (isRegistered) {
          alert('Registration successful!');
          this.router.navigate(['/login']); // Redirect to login page after successful registration
        } else {
          alert('User already exists.'); // Handle case where user already exists
        }
      }),
      catchError((error) => {
        console.error('Registration error', error);
        alert('An error occurred during registration.'); // Handle errors
        return of(false); // Return false to keep the observable chain intact
      })
    ).subscribe();


  }

}
