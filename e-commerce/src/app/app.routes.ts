import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CarritoComponent } from './component/carrito/carrito.component';
import { AppComponent } from './app.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register.component';


export const routes: Routes = [

  {path:'carrito', component:CarritoComponent},
  {path:'home', component:HomeComponent},
  {path: 'login', component:LoginPageComponent},
  {path:'register', component:RegisterComponent},
  {path:"**",redirectTo:"home"},
  
];
