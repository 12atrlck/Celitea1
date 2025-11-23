import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product, CartItem, Order, User } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ADMINS, INITIAL_USERS } from '../constants';
import { initializeChat } from '../services/geminiService';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  currentUser: User | null;
  users: User[];
  admins: User[];
  
  // Product Actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  
  // Order Actions
  placeOrder: (orderDetails: { name: string; email: string; address: string }) => Promise<void>;
  
  // Auth Actions
  login: (email: string, pass: string, type: 'user' | 'admin') => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  authorizeAdmin: (name: string, email: string, pass: string) => void;
  updateUser: (id: string, data: Partial<User>) => Promise<boolean>;
  
  // Stats
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Auth State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [admins, setAdmins] = useState<User[]>(INITIAL_ADMINS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    initializeChat(products);
  }, [products]);

  // --- Cart Logic ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (quantity > product.stock) return;
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (orderDetails: { name: string; email: string; address: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(c => c.id === p.id);
        if (cartItem) {
          return { ...p, stock: p.stock - cartItem.quantity };
        }
        return p;
      });
    });

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      date: new Date().toISOString(),
      status: 'Pending',
      customerName: orderDetails.name,
      customerEmail: orderDetails.email
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  // --- Admin Inventory Logic ---
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // --- Auth Logic ---
  const login = async (email: string, pass: string, type: 'user' | 'admin'): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Sim delay
    
    if (type === 'admin') {
      const admin = admins.find(u => u.email === email && u.password === pass);
      if (admin) {
        setCurrentUser({ ...admin, isOnline: true });
        return true;
      }
    } else {
      const user = users.find(u => u.email === email && u.password === pass);
      if (user) {
        // Update user online status in the list
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isOnline: true, lastActive: new Date().toISOString() } : u));
        setCurrentUser({ ...user, isOnline: true });
        return true;
      }
    }
    return false;
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const exists = users.find(u => u.email === email);
    if (exists) return false;

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: pass,
      role: 'user',
      isOnline: true,
      lastActive: new Date().toISOString()
    };
    
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    if (currentUser && currentUser.role === 'user') {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, isOnline: false } : u));
    }
    setCurrentUser(null);
  };

  const authorizeAdmin = (name: string, email: string, pass: string) => {
    const newAdmin: User = {
      id: 'admin-' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      password: pass,
      role: 'admin',
      isOnline: false
    };
    setAdmins(prev => [...prev, newAdmin]);
  };

  const updateUser = async (id: string, data: Partial<User>): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    
    // If the updated user is the current user, update that state too
    if (currentUser && currentUser.id === id) {
        setCurrentUser(prev => prev ? { ...prev, ...data } : null);
    }
    return true;
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{ 
      products, cart, orders, 
      currentUser, users, admins,
      addToCart, removeFromCart, updateQuantity, clearCart, 
      addProduct, removeProduct,
      placeOrder, 
      login, register, logout, authorizeAdmin, updateUser,
      cartTotal, cartCount
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};