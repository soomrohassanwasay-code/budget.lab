
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  password?: string;
  phone?: string;
  is_paid?: boolean;
  payment_expiry?: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  downloadUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  email: string;
  verified: boolean;
  date: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  avatar?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  total: number;
  items: CartItem[];
  status: 'pending' | 'completed' | 'cancelled';
}
