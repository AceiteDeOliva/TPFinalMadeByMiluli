import { UserService } from '../../services/user-service/user.service';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  credential$: Observable<string | null>; // Observable to hold credential
  accountMenuVisible: boolean = false; // To control the visibility of the account menu

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.credential$ = this.authService.getCredential(); // Subscribe to credential changes
  }

  ngOnInit(): void {
    // No need for checkUserCredentials here, as we're using BehaviorSubject for credential management
  }

  logout() {
    localStorage.removeItem('currentUser'); // Remove user from local storage
    this.authService.changeCredential(null); // Update the BehaviorSubject to null on logout
    this.router.navigate(['home']); // Navigate to the home page
  }

  toggleAccountMenu() {
    this.accountMenuVisible = !this.accountMenuVisible; // Toggle the visibility of the account menu
  }

  switchToUserMode() {
    this.authService.changeCredential('adminUser'); // Change credential to adminUser
  }

  switchToAdminMode() {
    this.authService.changeCredential('admin'); // Change credential to admin
  }

  isUserOrAdmin(): Observable<boolean> {
    return this.credential$.pipe(
      map(credential => credential === 'user' || credential === 'adminUser') // Map credential to boolean
    );
  }

  isAdminOrEmployee(): Observable<boolean> {
    return this.credential$.pipe(
      map(credential => credential === 'admin' || credential === 'employee' || credential === 'manager') // Map credential to boolean
    );
  }
}
