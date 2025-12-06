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
}

export interface RecentActivityFeedProps {
  data: ActivityData[];
}

interface OrderData {
  product: string;
  category: string;
  country: string;
  cr: string;
  value: string;
}

export interface RecentOrdersTableProps {
  data: OrderData[];
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

interface SupplierReliabilityData {
  name: string;
  value: number;
}

export interface SupplierReliabilityChartProps {
  data: SupplierReliabilityData[];
}
