import { UserService } from '../../services/user-service/user.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CategoryService } from '../../services/category-service/category-service.component';

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
    private categoryService: CategoryService
  ) {
    this.credential$ = this.authService.getCredential();
  }

  // Select a category and save it in CategoryService and localStorage
  selectCategory(category: string): void {
    this.categoryService.changeCategory(category); // Update CategoryService
    localStorage.setItem('selectedCategory', category); // Save to localStorage
  }

  ngOnInit(): void {
    // Check if there's a saved category in localStorage
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      this.categoryService.changeCategory(savedCategory); // Load saved category into the service
    }
  }

  logout() {
    localStorage.removeItem('currentUserId');
    this.authService.changeCredential(null); // Clear user credential
    this.router.navigate(['home']); // Navigate to home after logout
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

  // Check if the user is 'admin', 'employee', or 'manager'
  isAdminOrEmployee(): Observable<boolean> {
    return this.credential$.pipe(
      map(credential => credential === 'admin' || credential === 'employee' || credential === 'manager')
    );
  }

  onCategoryClick(category: string): void {
    this.categoryService.changeCategory(category); // Update the CategoryService with the selected category
    localStorage.setItem('selectedCategory', category); // Save the selected category in localStorage
    this.categorySelected.emit(category); // Emit the category to the parent component (if needed)
  }

}
