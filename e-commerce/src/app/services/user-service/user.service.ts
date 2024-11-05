import { User } from '../../models/user';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}


  register(name: string, surname:string, email: string, password: string, credential: 'user' | 'employee' | 'manager' | 'admin'): Observable<boolean> {//Creates new user json
    return this.checkUserExists(email).pipe(
      switchMap((exists) => {
        if (exists) {
          return of(false);
        } else {
          const newUser: Omit<User, 'id'> = { name , surname, email, password, cart: [], purchaseHistory: [], credential};
          return this.http.post<User>(this.apiUrl, newUser).pipe(
            map(() => true),
            catchError(() => of(false))
          );
        }
      })
    );
  }


  authenticateUser(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map((users) => {
        const user = users[0];
        const isValidUser = user && user.password === password;
        return isValidUser ? user : null;
      }),
      catchError(() => {
        console.error('Error fetching user data');
        return of(null);
      })
    );
  }


  private checkUserExists(email: string): Observable<boolean> { //Checks if email is already registered
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0) // Return true if user with that email exists
    );
  }

  getUser(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching users:', error); // Log error
        return of([]); // Return empty array on error
      })
    );
  }

  getCredential(userId: string): Observable<string> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`).pipe(
      map((user: User) => {
        console.log('Fetched user:', user); 
        return user.credential;
      }),
      catchError((error) => {
        console.error('Error fetching credential:', error);
        return of(''); 
      })
    );
}


  updateUser(userId: string, updatedFields: Partial<User>): Observable<User> { //updates user info
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, updatedFields).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => new Error('Error updating user'));
      })
    );
  }

  getUserById(userId: string): Observable<User> { //gets user by id
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); 
  }
  

  

}
