import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from '../user-service/user.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private credentialSubject = new BehaviorSubject<string | null>(null); // Initialize with null


  constructor(private userService: UserService) {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user: User) => {
          this.credentialSubject.next(user.credential || null);
        },
        error: () => {
          this.credentialSubject.next(null); // Si ocurre un error, establece credencial como null
        }
      });
    } else {
      this.credentialSubject.next(null);
    }
  }

  changeCredential(credential: string | null): void {
    this.credentialSubject.next(credential); // Update the BehaviorSubject with the new credential
  }

  getCredential(): Observable<string | null> {
    return this.credentialSubject.asObservable(); // Return the observable to subscribe to
  }
}
