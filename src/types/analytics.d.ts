export interface RawActivityLog {
  id: number;
  action: string;
  name: string | null;
  subject_type: "supplier" | "inventory";
  subject_id: number;
  category: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes: Record<string, any> | null;
  created_at: string; 
  updated_at: string;
}

export interface ActivityData {
  id: number;
  action: string;
  title: string;
  name?: string;
  category?: string;
  time: string;
  icon: string;
  color: string;
  iconColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes: Record<string, any> | null;
}

export interface MonthlyTargetData {
  progress: number;
  change: string;
  earningsToday: string;
  description: string;
  target: { value: string; trend: string };
  revenue: { value: string; trend: string };
  todayValue: { value: string; trend: string };
}

export interface MonthlyTargetCardProps {
  data: MonthlyTargetData;
}

export interface OverstockRiskCardProps {
  riskPercentage?: number;
}

export interface OrderData {
  product: string;
  category: string;
  value: string;
  valuePercentage: number;
}

export interface RecentOrdersTableProps {
  data: OrderData[];
  loading?: boolean;
}

export interface SeasonalDemandData {
  month: string;
  winter: number;
  spring: number;
  summer: number;
  autumn: number;
}

export interface SeasonalDemandChartProps {
  data: SeasonalDemandData[];
}

export interface PieDataPoint {
  name: string;
  value: number;
}

export interface ShrinkageLossCardProps {
  data: PieDataPoint[];
  colors: string[];
}

export interface SupplierReliabilityChartProps {
  data: Array<{
    name: string;
    requirements: number;
    quality: number;
    delivery: number;
    communication: number;
  }>;
}
