import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(email: string, password: string): Observable<boolean> {
    return this.checkUserExists(email).pipe(
      switchMap((exists) => {
        if (exists) {
          return of(false);
        } else {
          const newUser = { email, password, cart: [], purchaseHistory: [], credential: "user" };
          return this.http.post<User>(this.apiUrl, newUser).pipe(
            map(() => true),
            catchError(() => of(false))
          );
        }
      })
    );
  }


  authenticateUser(email: string, password: string): Observable<boolean> { 
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}`) 
      .pipe(
        map((users) => {
          console.log('API Response:', users); // Logs the response to check if users are retrieved correctly
          const user = users[0];
          const isValidUser = user.email === email && user.password === password; // Validate password
          console.log('Is Valid User:', isValidUser); // Log if valid user is found
          return isValidUser; 
        }),
        catchError(() => {
          console.error('Error fetching user data');
          return of(false); // Return false if any error occurs
        })
      );
  }

  private checkUserExists(email: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0) // Return true if user with that email exists
    );
  }
}
