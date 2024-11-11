import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categorySource = new BehaviorSubject<string>(''); // Initial category is empty
  currentCategory$ = this.categorySource.asObservable();

  constructor() { }

  // Method to change the current category
  changeCategory(category: string): void {
    this.categorySource.next(category); // Emit the new category value
  }

  // Method to reset the category (if needed)
  resetCategory(): void {
    this.categorySource.next(''); // Reset to empty category
  }
}
