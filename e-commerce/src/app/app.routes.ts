import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CarritoComponent } from './component/carrito/carrito.component';
import { AppComponent } from './app.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProductFormComponent } from './component/product-form/product-form.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ManageUsersPageComponent } from './pages/manage-users-page/manage-users-page.component';


export const routes: Routes = [

  {path:'carrito', component:CarritoComponent},
  {path:'home', component:HomeComponent},
  {path: 'login', component:LoginPageComponent},
  {path:'register', component:RegisterComponent},
  {path:'product-admin',component:ProductFormComponent},//HAY QUE CAMBIAR EL COMPONENT PUSE ESTE PARA PRUEBAS
  {path: 'profile',  component:ProfilePageComponent},
  {path: 'manageUsers', component:ManageUsersPageComponent },
  {path:"**",redirectTo:"home"}, // This one has to go last
  
];
