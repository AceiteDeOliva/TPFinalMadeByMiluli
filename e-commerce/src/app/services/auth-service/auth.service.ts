import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private credentialSubject = new BehaviorSubject<string | null>(null); // Initialize with null

  constructor() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.credentialSubject.next(currentUser.credential || null); // Set initial value from localStorage
  }

  changeCredential(credential: string | null): void {
    this.credentialSubject.next(credential); // Update the BehaviorSubject with the new credential
  }

  getCredential(): Observable<string | null> {
    return this.credentialSubject.asObservable(); // Return the observable to subscribe to
  }
}
