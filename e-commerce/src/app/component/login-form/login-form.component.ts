import { UserService } from '../../services/user-service/user.service';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth-service/auth.service';


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
    private userService: UserService,
    private authService: AuthService
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

      this.userService.authenticateUser(email, password).subscribe(user => {
        if (user) {
          alert('Login successful!');
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.authService.changeCredential(user.credential);
          this.router.navigate(['/home']);
        } else {
          alert('Invalid credentials. Please try again.');
        }
      });

    }
}
