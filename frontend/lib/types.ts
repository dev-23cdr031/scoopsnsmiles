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

export interface CheckoutItemPayload {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  address: string;
  items: CheckoutItemPayload[];
  totalAmount: number;
  note?: string;
}

export interface CreateOrderResponse {
  message: string;
  orderId: string;
  order: OrderResult;
}

export interface AdminCreateProductPayload {
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  featured?: boolean;
  badge?: string;
}

export interface AdminCreateProductResponse {
  message: string;
  product: Product;
}

export interface AdminUpdateOrderStatusResponse {
  message: string;
  order: OrderResult;
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

export interface AdminMlDatasetSummary {
  source: string;
  mode?: "kaggle-csv" | "synthetic-fallback";
  filePath?: string | null;
  records: number;
  products: number;
  startDate: string;
  endDate: string;
  catalogCoverage?: {
    matchedCatalogProducts: number;
    externalProducts: number;
  };
}

export interface AdminMlModelSummary {
  name: string;
  type: string;
  features: string[];
  mae: number;
  rmse: number;
  r2: number;
}

export interface AdminBestSeller {
  productId: number;
  productName: string;
  category: string;
  totalUnits: number;
  totalRevenue: number;
  avgDailyUnits: number;
  last30DaysUnits: number;
  growthPercent: number;
  trend: "rising" | "falling" | "stable";
  rank: number;
}

export interface AdminDemandPoint {
  date: string;
  predictedUnits: number;
}

export interface AdminDemandForecast {
  productId: number;
  productName: string;
  category: string;
  rank: number;
  avgDailyPrediction: number;
  predictedPeriodTotal: number;
  demandConfidenceBand: {
    low: number;
    high: number;
  };
  nextDays: AdminDemandPoint[];
}

export interface AdminMlInsights {
  generatedAt: string;
  dataset: AdminMlDatasetSummary;
  model: AdminMlModelSummary;
  bestSellers: AdminBestSeller[];
  demand: {
    forecasts: AdminDemandForecast[];
    overallForecast: AdminDemandPoint[];
    topDemandProducts: AdminDemandForecast[];
  };
}
