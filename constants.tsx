
import { Product, Review } from './types';

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'budget-families-couples',
    title: 'Budget for Families & Couples Excel Sheet Template',
    category: 'Excel Sheet',
    price: 0,
    originalPrice: 0,
    rating: 5.0,
    reviewCount: 243,
    images: [
      'https://images.unsplash.com/photo-1454165833767-027eeef1596e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=800&auto=format&fit=crop'
    ],
    description: 'A comprehensive budget tracking solution designed specifically for households and couples to manage finances together.',
    features: [
      'Dual income tracking',
      'Joint expense categorization',
      'Savings goals for two',
      'Interactive monthly dashboard'
    ]
  },
  {
    id: 'crypto-portfolio-master',
    title: 'Crypto Portfolio Tracking Dashboard V2',
    category: 'Google Sheets',
    price: 0,
    originalPrice: 0,
    rating: 4.8,
    reviewCount: 156,
    images: ['https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=800&auto=format&fit=crop'],
    description: 'Track your crypto assets across exchanges with live price updates.',
    features: ['Real-time API integration', 'Profit/Loss visualization', 'Asset allocation pie charts']
  },
  {
    id: 'business-cashflow-pro',
    title: 'Business Cashflow & Profit Planning Template',
    category: 'Excel Sheet',
    price: 0,
    originalPrice: 0,
    rating: 4.9,
    reviewCount: 89,
    images: ['https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=800&auto=format&fit=crop'],
    description: 'The ultimate tool for small business owners to forecast and track every penny.',
    features: ['Expense projections', 'Tax estimation module', 'Burn rate calculator']
  }
];

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'budget-families-couples',
    author: 'Sarah J.',
    email: 'sarah@example.com',
    verified: true,
    date: '2 days ago',
    rating: 5,
    title: 'Excellent template!',
    content: 'Perfect for me and my husband. Very easy to use.',
    avatar: 'https://i.pravatar.cc/150?u=sarah'
  }
];

export const UPSELL_ITEMS = [
  { id: 'upsell-stock', title: 'Stock Tracker Add-on', price: 0, icon: '📈' },
  { id: 'upsell-crypto', title: 'Crypto E-Book Bundle', price: 0, icon: '₿' },
  { id: 'upsell-habit', title: 'Habit Tracker Master', price: 0, icon: '✨' }
];
