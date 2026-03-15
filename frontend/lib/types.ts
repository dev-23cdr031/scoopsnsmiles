export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  featured: boolean;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Testimonial {
  id: number;
  author: string;
  role: string;
  content: string;
  rating: number;
  image: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface SpecialOffer {
  id: number;
  title: string;
  description: string;
  discount: string;
  validTill: string;
  image: string;
}

export interface GiftCard {
  id: number;
  name: string;
  amount: number;
  description: string;
}

export type OrderStatus =
  | "confirmed"
  | "preparing"
  | "baking"
  | "ready"
  | "out-for-delivery"
  | "delivered";

export interface OrderResult {
  orderId: string;
  status: OrderStatus;
  items: string[];
  totalAmount: number;
  orderDate: string;
  estimatedDelivery: string;
  customerName: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  message: string;
  ticketId: string;
}

export interface NewsletterResponse {
  message: string;
  alreadySubscribed: boolean;
}
