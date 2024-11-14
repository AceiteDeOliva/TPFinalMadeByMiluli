import { ProductUpdateFormComponent } from './component/product-update-form/product-update-form.component';
import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './component/cart/cart.component';
import { AppComponent } from './app.component';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterComponent } from './pages/register/register.component';

import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ManageUsersPageComponent } from './pages/manage-users-page/manage-users-page.component';
import { ManageProductPageComponent } from './pages/manage-product-page/manage-product-page.component';
import { NewProductPageComponent } from './pages/new-product-page/new-product-page.component';
import { UpdateProductPageComponent } from './pages/update-product-page/update-product-page.component';
import { RegisterEmployeeComponent } from './pages/register-employee/register-employee.component';
import { ActiveProductPagesComponent } from './pages/active-product-pages/active-product-pages.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';
import { CheckoutComponent } from './component/checkOut/check-out/check-out.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { PurchaseLoginPageComponent } from './pages/active-product-pages/purchase-login-page/purchase-login-page.component';
import { ShippingInfoPageComponent } from './pages/shipping-info-page/shipping-info-page.component';





export const routes: Routes = [

  { path: 'myCart', component: CartPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'listCategory', component: CategoriesComponent },
  { path: "activeProducts", component: ActiveProductPagesComponent },
  { path: 'registerEmployee', component: RegisterEmployeeComponent },
  { path: 'productAdmin', component: ManageProductPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'manageUsers', component: ManageUsersPageComponent },
  { path: 'nuevoProducto', component: NewProductPageComponent },
  { path: 'updateProduct/:id', component: UpdateProductPageComponent },
  { path: 'productView/:productId', component: ProductPageComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'loginPurchase', component:PurchaseLoginPageComponent },
  { path: 'shippingInfo', component: ShippingInfoPageComponent},
  { path: "**", redirectTo: "home" },

];
