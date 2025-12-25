export type NotificationType =
  | "market_update"
  | "inventory_alert"
  | "price_alert"
  | "system";

export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  created_at: string;
  read_at: string | null;
}
