import type {
  Category,
  ContactPayload,
  ContactResponse,
  GiftCard,
  NewsletterResponse,
  OrderResult,
  Product,
  SpecialOffer,
  TeamMember,
  Testimonial
} from "@/lib/types";

type ProductQuery = {
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: "default" | "price-low" | "price-high" | "name";
  limit?: number;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (typeof value !== "undefined") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function request<T>(path: string, init?: RequestInit, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {})
    }
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

async function safeRequest<T>(path: string, fallback: T, init?: RequestInit, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
  try {
    return await request<T>(path, init, query);
  } catch {
    return fallback;
  }
}

export async function getProducts(query?: ProductQuery): Promise<Product[]> {
  return safeRequest<Product[]>("/api/products", [], undefined, query);
}

export async function getProductById(id: number): Promise<Product | null> {
  return safeRequest<Product | null>(`/api/products/${id}`, null);
}

export async function getCategories(): Promise<Category[]> {
  return safeRequest<Category[]>("/api/categories", []);
}

export async function getTestimonials(limit?: number): Promise<Testimonial[]> {
  return safeRequest<Testimonial[]>("/api/testimonials", [], undefined, { limit });
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return safeRequest<TeamMember[]>("/api/team", []);
}

export async function getOffers(): Promise<SpecialOffer[]> {
  return safeRequest<SpecialOffer[]>("/api/offers", []);
}

export async function getGiftCards(): Promise<GiftCard[]> {
  return safeRequest<GiftCard[]>("/api/gift-cards", []);
}

export async function trackOrder(orderId: string): Promise<OrderResult | null> {
  return safeRequest<OrderResult | null>(`/api/orders/${encodeURIComponent(orderId)}`, null);
}

export async function subscribeNewsletter(email: string): Promise<NewsletterResponse | null> {
  return safeRequest<NewsletterResponse | null>(
    "/api/newsletter",
    null,
    {
      method: "POST",
      body: JSON.stringify({ email })
    }
  );
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse | null> {
  return safeRequest<ContactResponse | null>(
    "/api/contact",
    null,
    {
      method: "POST",
      body: JSON.stringify(payload)
    }
  );
}
