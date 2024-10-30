import { Component, inject } from '@angular/core';
import { Router, RouterEvent, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from '../../pages/home/home.component';
import { CarritoComponent } from '../carrito/carrito.component';
import { UserControlService } from '../../service/user-control.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet,RouterModule,CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {


  credential: string | null = "admin"; 
  accountMenuVisible: boolean = false;

  constructor(private userControlService: UserControlService) {}

  ngOnInit(): void {
    this.checkUserCredentials();
  }

  checkUserCredentials(): void {
    this.userControlService.getCredential().subscribe((cred: string) => {
      this.credential = cred || null; 
    });
  }
  toggleAccountMenu() {
    this.accountMenuVisible = !this.accountMenuVisible;
  }
  switchToUserMode() {
    this.credential = 'adminUser';
  }
  switchToAdmiMode() {
    this.credential = 'admin';
  }


 }
  


