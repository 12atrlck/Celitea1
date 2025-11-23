export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: 'Sleep' | 'Energy' | 'Digestion' | 'Immunity' | 'Relaxation';
  ingredients: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  customerName: string;
  customerEmail: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, never store plain text passwords
  role: 'user' | 'admin';
  isOnline?: boolean;
  lastActive?: string;
}
