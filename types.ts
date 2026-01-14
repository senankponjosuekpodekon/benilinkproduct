
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: 'Huile' | 'Beurre' | 'Poudre' | 'Farine' | 'Céréale' | 'Épice' | 'Poisson';
  unit: 'litre' | 'kilo' | 'g' | 'ml' | 'sachet' | 'unité';
  image: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export type CategoryFilter = 'Tous' | 'Huile' | 'Beurre' | 'Poudre' | 'Farine' | 'Céréale' | 'Épice' | 'Poisson';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
