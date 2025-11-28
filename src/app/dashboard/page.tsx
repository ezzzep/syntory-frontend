import StatsCards from "./statsCards";
import SalesChart from "./salesChart";
import TopListsCards from "./topListCards";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full bg-gray-900 p-6">
      <StatsCards />
      <SalesChart />
      <TopListsCards />
    </div>
  );
}
