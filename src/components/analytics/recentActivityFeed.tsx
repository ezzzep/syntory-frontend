import { RecentActivityFeedProps } from "@/types/analytics";

export default function RecentActivityFeed({ data }: RecentActivityFeedProps) {
  const activityArray = Array.isArray(data) ? data : [];

  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 h-full flex flex-col">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Recent Activity Feed
        </h2>
        <div className="flex gap-2 flex-wrap">
          <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-xs sm:text-sm">
            All
          </button>
          <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-600/50 transition-colors text-xs sm:text-sm">
            Orders
          </button>
          <button className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-600/50 transition-colors text-xs sm:text-sm">
            Alerts
          </button>
        </div>
      </div>
      <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto">
        {activityArray.length === 0 ? (
          <p className="text-gray-400 text-sm text-center mt-4">
            No recent activity.
          </p>
        ) : (
          activityArray.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-slate-700/30 transition-colors"
            >
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${activity.color} ${activity.iconColor}`}
              >
                <span className="text-lg sm:text-xl">{activity.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                      {activity.title}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-1 sm:line-clamp-none">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="mt-4 sm:mt-6 text-center">
        <button className="px-4 sm:px-6 py-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 transition-colors text-sm">
          Load More Activities
        </button>
      </div>
    </div>
  );
}
