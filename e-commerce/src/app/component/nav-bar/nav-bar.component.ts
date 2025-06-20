import { UserService } from '../../services/user-service/user.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryService } from '../../services/category-service/category-service.component';
import { FavoritesService } from '../../services/favorites-service/favorites.service';

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

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private categoryService: CategoryService,
    private favoriteService: FavoritesService,
  ) {
    this.credential$ = this.authService.getCredential();
  }


  selectCategory(category: string): void {
    this.categoryService.changeCategory(category);
    localStorage.setItem('selectedCategory', category);
  }

  ngOnInit(): void {

    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.categoryService.changeCategory(savedCategory);
    }
  }
logout() {
  localStorage.removeItem('currentUserId');
  localStorage.removeItem('selectedCategory');
  localStorage.removeItem('guestFavorites');
  console.log('User logged out',localStorage.getItem('currentUserId'));
  this.authService.changeCredential(null);
  this.router.navigate(['home']);
}

  toggleAccountMenu(isVisible: boolean) {
    this.accountMenuVisible = isVisible;
  }

  toggleCategoryMenu(isVisible: boolean) {
    this.categoryMenuVisible = isVisible;
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

  onCategoryClick(category: string): void {
    this.categoryService.changeCategory(category);
    localStorage.setItem('selectedCategory', category);
    this.categorySelected.emit(category);
  }

  cartButton() {
    this.router.navigate(['/myCart']);
  }
}
