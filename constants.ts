import { Product, User } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'tea-001',
    name: 'Golden Slumber Chamomile',
    description: 'A soothing blend of whole chamomile flowers and lavender buds to help you drift off into a peaceful sleep.',
    price: 12.50,
    stock: 45,
    image: 'https://picsum.photos/id/225/800/800',
    category: 'Sleep',
    ingredients: ['Egyptian Chamomile', 'French Lavender', 'Valerian Root'],
  },
  {
    id: 'tea-002',
    name: 'Morning Zing Ginger Lemon',
    description: 'Wake up refreshed with this spicy ginger and zesty lemon blend. Caffeine-free energy booster.',
    price: 14.00,
    stock: 30,
    image: 'https://picsum.photos/id/431/800/800',
    category: 'Energy',
    ingredients: ['Ginger Root', 'Lemongrass', 'Lemon Peel', 'Black Pepper'],
  },
  {
    id: 'tea-003',
    name: 'Peppermint Clarity',
    description: 'Pure, refreshing peppermint leaves sourced from the Pacific Northwest. Great for digestion and focus.',
    price: 11.00,
    stock: 50,
    image: 'https://picsum.photos/id/106/800/800',
    category: 'Digestion',
    ingredients: ['Peppermint Leaves'],
  },
  {
    id: 'tea-004',
    name: 'Hibiscus Heartbeat',
    description: 'Tart and fruity hibiscus tea rich in antioxidants. A vibrant red brew that tastes great hot or iced.',
    price: 13.50,
    stock: 20,
    image: 'https://picsum.photos/id/152/800/800',
    category: 'Immunity',
    ingredients: ['Hibiscus Flowers', 'Rosehips', 'Orange Peel'],
  },
  {
    id: 'tea-005',
    name: 'Turmeric Glow',
    description: 'An anti-inflammatory powerhouse blend with golden turmeric, warming cinnamon, and sweet licorice.',
    price: 15.00,
    stock: 15,
    image: 'https://picsum.photos/id/292/800/800',
    category: 'Immunity',
    ingredients: ['Turmeric', 'Cinnamon', 'Licorice Root', 'Ginger'],
  },
  {
    id: 'tea-006',
    name: 'Rooibos Vanilla Sky',
    description: 'Smooth and creamy South African red tea with natural Madagascar vanilla notes. Naturally caffeine-free.',
    price: 13.00,
    stock: 40,
    image: 'https://picsum.photos/id/360/800/800',
    category: 'Relaxation',
    ingredients: ['Rooibos', 'Vanilla Bean', 'Almond pieces'],
  },
];

export const INITIAL_ADMINS: User[] = [
  {
    id: 'admin-1',
    name: 'Head Master',
    email: 'patick910@gmail.com',
    password: 'Obiajuru09', 
    role: 'admin',
    isOnline: false,
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Tea Lover',
    email: 'user@example.com',
    password: 'user',
    role: 'user',
    isOnline: false,
    lastActive: new Date().toISOString()
  }
];