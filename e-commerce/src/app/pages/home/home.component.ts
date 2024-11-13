import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../../component/nav-bar/nav-bar.component";
import { ProductSliderComponent } from "../../component/product-slider/product-slider.component";
import { HomeSelectionsComponent } from "../../component/home-selections/home-selections.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductSliderComponent, HomeSelectionsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
