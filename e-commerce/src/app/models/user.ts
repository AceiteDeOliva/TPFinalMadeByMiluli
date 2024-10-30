export interface User {
    email: string;
    password: string;
    cart: Array<{ productId: string; quantity: number }>;
    purchaseHistory: Array<{ productId: string; quantity: number; date: Date }>;
    credential: 'user' | 'employee'|'manager'|'admin';
}