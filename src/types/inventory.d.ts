export interface InventoryItem {
  id: number;
  name: string;
  category?: string | null;
  quantity: number;
  description?: string | null;
  image_path: string;
  supplier_name?: string;
  price: number;
}

export interface CreateInventoryDto {
  name: string;
  category?: string;
  quantity: number;
  description?: string;
  supplier_name?: string;
  price: number;
}

export interface UpdateInventoryDto {
  name: string;
  category?: string;
  quantity: number;
  description?: string;
  supplier_name?: string;
   price: number;
}
