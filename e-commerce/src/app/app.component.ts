import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarPrincipalComponent } from "./components/navbar_principal/navbar-principal/navbar-principal.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarPrincipalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'e-commerce';
}
