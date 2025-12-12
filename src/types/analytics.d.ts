interface MonthlyTargetData {
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

interface ActivityData {
  id: number;
  type: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
  iconColor: string;
  action?: string;
  item_name?: string;
  item_id?: number;
  item_category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes?: Record<string, any> | any[];
  
}
export interface RecentActivityFeedProps {
  data: ActivityData[];
}

interface OrderData {
  product: string;
  category: string;
  value: string; 
  valuePercentage: number;
}

export interface RecentOrdersTableProps {
  data: OrderData[];
  loading?: boolean; 
}

interface SeasonalDemandData {
  month: string;
  winter: number;
  spring: number;
  summer: number;
  autumn: number;
}

export interface SeasonalDemandChartProps {
  data: SeasonalDemandData[];
}

export interface ShrinkageLossCardProps {
  data: PieProps["data"];
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

interface SupplierReliabilityData {
  name: string;
  value: number;
}
