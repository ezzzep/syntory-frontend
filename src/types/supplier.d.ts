export type SupplierCategory =
  | "appliances"
  | "home-living"
  | "gadgets"
  | "home-cleaning";

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  category: SupplierCategory;
  lastDelivery: string;
  totalOrders: number;
  rating: number;
}
