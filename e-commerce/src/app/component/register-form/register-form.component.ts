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
    this.setAvailableCredentials();  // Llamar al método para establecer credenciales disponibles
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

    if (this.registerForm.invalid) { // checks if all fields are filled
      alert('Please fill in all required fields.');
      return;
    }

    const { name, surname, email, password, password2 , credential} = this.registerForm.value;

    if (password !== password2) { //checks if passwords match
      alert('Passwords do not match.');
      return;
    }


    this.userService.register(name, surname, email, password, credential).pipe(
      tap((isRegistered) => {
        if (isRegistered) {
          alert('Registration successful!');
          if(this.credential === "user" || this.credential === ''){
            this.router.navigate(['/login']);
          }else{
            this.router.navigate(['/manageUsers']);
          } 
        } else {
          alert('User already exists.');
        }
      }),
      catchError((error) => {
        console.error('Registration error', error);
        alert('An error occurred during registration.'); 
        return of(false); 
      })
    ).subscribe();

  }

}
