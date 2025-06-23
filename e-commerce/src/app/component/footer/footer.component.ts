import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  credential$: Observable<string | null>;
  constructor(

      private authService: AuthService,

    ) {
      this.credential$ = this.authService.getCredential();
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

}
