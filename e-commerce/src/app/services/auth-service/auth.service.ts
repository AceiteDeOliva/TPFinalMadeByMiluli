import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private credentialSubject = new BehaviorSubject<string | null>(null); // Initialize with null
 islogin:boolean =false;
 canCheckout: boolean = false;
 canship: boolean = false;

  constructor(private userService: UserService) {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user: User) => {
          this.credentialSubject.next(user.credential || null);
        },
        error: () => {
          this.credentialSubject.next(null);
        }
      });
    } else {
      this.credentialSubject.next(null);
    }
  }

  changeCredential(credential: string | null): void {
    this.credentialSubject.next(credential);
  }

  getCredential(): Observable<string | null> {
    return this.credentialSubject.asObservable();
  }

  login(userCredential: string) {
    const user = { isLogin: true, credential: userCredential };
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout() {
    localStorage.removeItem('currentUser');
  }

  get currentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  get isLogin() {
    return this.currentUser && this.currentUser.isLogin;
  }

  //
  get credential() {
    return this.currentUser ? this.currentUser.credential : null;
  }
  enableCheckout() {
    this.canCheckout = true; // Set it to true to allow checkout
  }

  disableCheckout() {
    this.canCheckout = false; // Set it to false to disallow checkout
  }

  // Use this to check if the user can checkout
  isCheckoutEnabled(): boolean {
    return this.canCheckout;
  }
  enableShipping() {
    this.canship = true; // Set it to true to allow checkout
  }

  disableShipping() {
    this.canship = false; // Set it to false to disallow checkout
  }

  // Use this to check if the user can checkout
  isShippingEnabled(): boolean {
    return this.canship;
  }
}
