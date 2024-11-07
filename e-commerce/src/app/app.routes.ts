import { ProductUpdateFormComponent } from './component/product-update-form/product-update-form.component';
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
import { ManageProductPageComponent } from './pages/manage-product-page/manage-product-page.component';


export const routes: Routes = [

  {path:'carrito', component:CarritoComponent},
  {path:'home', component:HomeComponent},
  {path: 'login', component:LoginPageComponent},
  {path:'register', component:RegisterComponent},
  {path:'product-admin',component:ManageProductPageComponent},
  {path: 'profile',  component:ProfilePageComponent},
  {path: 'manageUsers', component:ManageUsersPageComponent },
  {path:'nuevoProducto', component: ProductFormComponent},
  { path: 'updateProduct/:id', component: ProductUpdateFormComponent },
  {path:"**",redirectTo:"home"}, // This one has to go last
  
];
