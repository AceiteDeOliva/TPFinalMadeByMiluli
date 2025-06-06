import { CartItem } from "./cartItem";
import { Order } from "./orders";

export interface User {
    id:string;
    name: string;
    surname: string;
    email: string;
    password: string;
    cart: CartItem[];
    purchaseHistory: Order[];
    favoriteList: string[];
    credential: 'user' | 'employee'|'manager'|'admin';
}
