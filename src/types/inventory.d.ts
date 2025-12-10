export interface InventoryItem {
  id: number;
  name: string;
  category?: string | null;
  quantity: number;
  description?: string | null;
  image_path: string;
}

export interface CreateInventoryDto {
  name: string;
  category?: string;
  quantity: number;
  description?: string;
}

export interface UpdateInventoryDto {
  name: string;
  category?: string;
  quantity: number;
  description?: string;
}
