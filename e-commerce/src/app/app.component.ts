import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { CarritoComponent } from './component/carrito/carrito.component';
import { FooterComponent } from "./component/footer/footer.component";
import { ProductFormComponent } from "./component/product-form/product-form.component";





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, HomeComponent, CarritoComponent, FooterComponent, ProductFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'e-commerce';
}
