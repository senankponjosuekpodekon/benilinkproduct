
export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: 'Huile' | 'Beurre' | 'Poudre';
  unit: 'litre' | 'kilo';
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

export type CategoryFilter = 'Tous' | 'Huile' | 'Beurre' | 'Poudre';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
