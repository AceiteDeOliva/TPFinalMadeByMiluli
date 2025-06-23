import { ProductUpdateFormComponent } from './component/product-update-form/product-update-form.component';
import { Component } from '@angular/core';
import { Routes, ActivatedRoute } from '@angular/router';
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
import { CheckoutComponent } from './component/check-out/check-out.component';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { PurchaseLoginPageComponent } from './pages/purchase-login-page/purchase-login-page.component';
import { ShippingInfoPageComponent } from './pages/shipping-info-page/shipping-info-page.component';
import { PaymentStatusComponent } from './component/payment-status/payment-status.component';
import { HomeEmployeeComponent } from './component/home-employee/home-employee.component';
import { LowStockListComponent } from './pages/low-stock-list/low-stock-list.component';
import { LoginForOrderPagesComponent } from './pages/login-for-order-pages/login-for-order-pages.component';
import { PurchaseHistoryComponent } from './component/purchase-history-list/purchase-history-list.component';
import { OrderListComponent } from './component/order-list/order-list.component';
import { authGuardFn } from './guard/auth.guard-fn';
import { authGuardFnCheckOut } from './guard/auth.guard-fn-checkout';
import { authGuardFnShipping } from './guard/auth.guard-fn-shipping';
import { UnauthorizedPageComponent } from './pages/unauthorized-page/unauthorized-page.component';
import { FavoritesListComponent } from './pages/favorites-list-page/favorites-list.component';
import { PurchaseHistoryPageComponent } from './pages/purchase-history-page/purchase-history-page.component';





export const routes: Routes = [

  { path: 'myCart', component: CartPageComponent },
  { path: 'home', component: HomeComponent },
  { path: 'homeEmployee', component: HomeEmployeeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'listCategory', component: CategoriesComponent },

  { path: 'favorites', component: FavoritesListComponent},
  { path: "activeProducts", component: ActiveProductPagesComponent },
  { path: 'registerEmployee', component: RegisterEmployeeComponent, canActivate: [() => authGuardFn(['admin', 'manager'])] },
  { path: 'productAdmin', component: ManageProductPageComponent, canActivate: [() => authGuardFn(['admin', 'manager', 'employee'])] },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'manageUsers', component: ManageUsersPageComponent, canActivate: [() => authGuardFn(['admin', 'manager'])] },
  { path: 'nuevoProducto', component: NewProductPageComponent, canActivate: [() => authGuardFn(['admin', 'manager'])] },
  { path: 'updateProduct/:id', component: UpdateProductPageComponent, canActivate: [() => authGuardFn(['admin', 'manager', 'employee'])] },
  { path: 'productView/:productId', component: ProductPageComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuardFnCheckOut] },
  { path: 'loginPurchase', component: PurchaseLoginPageComponent },
  { path: 'shippingInfo', component: ShippingInfoPageComponent, canActivate: [authGuardFnShipping] },
  { path: 'lowStock', component: LowStockListComponent, canActivate: [() => authGuardFn(['admin', 'manager', 'employee'])] },
  { path: 'payment-status', component: PaymentStatusComponent },
  { path: 'loginForOrder', component: LoginForOrderPagesComponent },
  { path: 'purchaseHistory', component: PurchaseHistoryPageComponent },
  { path: 'unauthorized', component: UnauthorizedPageComponent },
  { path: 'orders', component: OrderListComponent, canActivate: [() => authGuardFn(['admin', 'manager', 'employee'])] },
  { path: "**", redirectTo: "home" },

];
