"use client";

export default function TopListsCards() {
  const topOrders = [
    "John Doe",
    "Johnny Bravo",
    "John Cena",
    "Bruce Wayne",
    "Clark Kent",
  ];
  const topSuppliers = [
    "Supplier A",
    "Supplier B",
    "Supplier C",
    "Supplier D",
    "Supplier E",
  ];
  const ordersOverview = [
    { label: "Completed", value: 431, color: "bg-green-500" },
    { label: "Pending", value: 92, color: "bg-yellow-500" },
    { label: "Cancelled", value: 17, color: "bg-red-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      
      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Top Orders</h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          {topOrders.map((name, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                  i === 0
                    ? "bg-yellow-500/20 text-yellow-400"
                    : i === 1
                    ? "bg-gray-400/20 text-gray-300"
                    : i === 2
                    ? "bg-orange-600/20 text-orange-400"
                    : "bg-slate-600/20 text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <p className="text-sm sm:text-base text-white truncate">{name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Top Suppliers</h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              ></path>
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          {topSuppliers.map((supply, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                  i === 0
                    ? "bg-yellow-500/20 text-yellow-400"
                    : i === 1
                    ? "bg-gray-400/20 text-gray-300"
                    : i === 2
                    ? "bg-orange-600/20 text-orange-400"
                    : "bg-slate-600/20 text-slate-400"
                }`}
              >
                {i + 1}
              </div>
              <p className="text-sm sm:text-base text-white truncate">
                {supply}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold">Orders Overview</h2>
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
          </div>
        </div>
        <div className="space-y-4">
          {ordersOverview.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                <p className="text-sm sm:text-base text-white">{item.label}</p>
              </div>
              <p className="text-sm sm:text-base font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
          <div className="pt-2 border-t border-slate-700/50">
            <div className="flex items-center justify-between">
              <p className="text-sm sm:text-base text-gray-400">Total</p>
              <p className="text-sm sm:text-base font-semibold text-white">
                {ordersOverview.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
