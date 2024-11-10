import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './component/cart/cart.component';
import { FooterComponent } from "./component/footer/footer.component";
import { ProductFormComponent } from "./component/product-form/product-form.component";
import { ProductListComponent } from './component/product-list/product-list.component';





@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'e-commerce';
}
