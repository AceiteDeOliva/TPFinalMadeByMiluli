import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from "../../component/nav-bar/nav-bar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
