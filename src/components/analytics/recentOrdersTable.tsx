import { RecentOrdersTableProps } from "@/types/analytics";

export default function RecentOrdersTable({ data }: RecentOrdersTableProps) {
  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl sm:text-2xl font-semibold">Recent Orders</h2>
        <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-sm">
          Filter
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="border-b border-slate-700/50 text-gray-400">
            <tr>
              <th className="pb-3 text-xs sm:text-sm">Product</th>
              <th className="pb-3 text-xs sm:text-sm">Category</th>
              <th className="pb-3 text-xs sm:text-sm">Country</th>
              <th className="pb-3 text-xs sm:text-sm">CR</th>
              <th className="pb-3 text-xs sm:text-sm">Value</th>
            </tr>
          </thead>
          <tbody>
            {data.map((order, i) => (
              <tr
                key={i}
                className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-2 sm:py-3 text-xs sm:text-sm">
                  {order.product}
                </td>
                <td className="py-2 sm:py-3 text-xs sm:text-sm">
                  {order.category}
                </td>
                <td className="py-2 sm:py-3 text-lg sm:text-xl">
                  {order.country}
                </td>
                <td className="py-2 sm:py-3 text-xs sm:text-sm">{order.cr}</td>
                <td className="py-2 sm:py-3 text-green-400 text-xs sm:text-sm">
                  {order.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
