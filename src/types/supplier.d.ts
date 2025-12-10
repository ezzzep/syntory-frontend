export type SupplierCategory =
  | "appliances"
  | "home-living"
  | "gadgets"
  | "home-cleaning";

export interface Supplier {
  image_url: string;
  id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  category: SupplierCategory;
  last_delivery: string;
  total_orders: number;
  rating: number;
  image_path: string;
  quality_rating?: number;
  delivery_rating?: number;
  communication_rating?: number;
}

export interface CreateSupplier {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  category: SupplierCategory;
  last_delivery: string;
}

export interface UpdateSupplier {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  location: string;
  category: SupplierCategory;
  last_delivery: string;
  total_orders: number;
  rating: number;
  quality_rating?: number;
  delivery_rating?: number;
  communication_rating?: number;
}
