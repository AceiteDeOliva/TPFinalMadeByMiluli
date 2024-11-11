import { UserService } from '../../services/user-service/user.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  credential$: Observable<string | null>;
  accountMenuVisible: boolean = false;
  categoryMenuVisible: boolean = false;
  @Output() categorySelected = new EventEmitter<string>();


  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.credential$ = this.authService.getCredential();
  }



  selectCategory(category: string): void {
    this.categorySelected.emit(category); 
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

  toggleCategoryMenu() {
    this.categoryMenuVisible = !this.categoryMenuVisible;
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
