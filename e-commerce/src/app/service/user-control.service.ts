import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserControlService {

  private usersUrl="";
  constructor(private http: HttpClient) { }
  getUser(): Observable <any[]>{
    return this.http.get<any[]>(this.usersUrl);
  }

  getCredential(): Observable<string> {
    return this.http.get<any>(this.usersUrl).pipe(
      map((data: { credential: string }) => data.credential)
    );
  }
}
