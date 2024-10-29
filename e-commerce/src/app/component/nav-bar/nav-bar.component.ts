import { Component } from '@angular/core';
import { Router, RouterEvent, RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from '../../pages/home/home.component';
import { CarritoComponent } from '../carrito/carrito.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterOutlet,RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

}
