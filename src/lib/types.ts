

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number | null;
  images: string[];
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ProductCategory {
    name: string;
    logo?: string;
    products: Product[];
}

export interface Category {
  id: string;
  name: string;
  logo: string;
  order: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar: string;
  fallback: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  fallback: string;
}

export interface Metric {
  id: string;
  value: number;
  label: string;
  color: string;
}

export interface PromoBanner {
  text: string;
  link: string;
  isActive: boolean;
  backgroundColor: string;
  textColor: string;
}

export interface TikTokEmbed {
  embedCode: string;
  isActive: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface CheckoutSession {
    id?: string;
    customerId: string;
    line_items: any[];
    success_url: string;
    cancel_url: string;
    metadata: {
        userEmail: string;
    };
    url?: string;
    error?: {
        message: string;
    }
}
