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
  credential$: Observable<string | null>;
  accountMenuVisible: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.credential$ = this.authService.getCredential();
  }

  ngOnInit(): void {

  }

  logout() {
    localStorage.removeItem('currentUserId');
    this.authService.changeCredential(null);
    this.router.navigate(['home']);
  }
  toggleAccountMenu() {
    this.accountMenuVisible = !this.accountMenuVisible;
  }

  switchToUserMode() {
    this.authService.changeCredential('adminUser');
  }

  switchToAdminMode() {
    this.authService.changeCredential('admin');
  }

  isUserOrAdmin(): Observable<boolean> {
    return this.credential$.pipe(
      map(credential => credential === 'user' || credential === 'adminUser')
    );
  }

  isAdminOrEmployee(): Observable<boolean> {
    return this.credential$.pipe(
      map(credential => credential === 'admin' || credential === 'employee' || credential === 'manager')
    );
  }

  
}
