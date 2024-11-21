import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categorySource = new BehaviorSubject<string>('');
  currentCategory$ = this.categorySource.asObservable();

  constructor() { }


  changeCategory(category: string): void {
    this.categorySource.next(category);
  }


  resetCategory(): void {
    this.categorySource.next(''); 
  }
}
