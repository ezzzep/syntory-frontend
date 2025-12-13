import { useState } from "react";
import { RecentActivityFeedProps } from "@/types/analytics";

export default function RecentActivityFeed({ data }: RecentActivityFeedProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const filterOptions = ["Orders", "Alerts", "Entries"];
  const activityArray = Array.isArray(data) ? data : [];

  const filteredActivities = selectedFilter
    ? activityArray.filter(
        (activity) => activity.type === selectedFilter.toLowerCase()
      )
    : activityArray;

  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return { date: "", time: "" };

    const parts = dateTimeString.split(",");
    if (parts.length >= 2) {
      return {
        date: parts[0].trim(),
        time: parts[1].trim(),
      };
    }

    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
      };
    } catch {
      return { date: dateTimeString, time: "" };
    }
  };

  return (
    <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-700/50 h-full flex flex-col">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Recent Activity Feed
        </h2>
        <div className="flex gap-2 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap items-center">
            <button
              className={`px-3 sm:px-4 py-2 rounded-xl transition-colors text-xs sm:text-sm ${
                !selectedFilter ? "bg-slate-700/50" : "bg-slate-700/30"
              } hover:bg-slate-600/50`}
              onClick={() => setSelectedFilter(null)}
            >
              All
            </button>

            {selectedFilter && (
              <div className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/50 text-xs sm:text-sm flex items-center gap-2">
                <span>{selectedFilter}</span>
                <button
                  className="hover:bg-slate-600/50 rounded-full p-0.5 transition-colors"
                  onClick={() => setSelectedFilter(null)}
                  aria-label="Clear filter"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="px-3 sm:px-4 py-2 rounded-xl bg-slate-700/30 hover:bg-slate-600/50 transition-colors text-xs sm:text-sm flex items-center gap-1"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>Filter</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-slate-700 rounded-lg shadow-lg z-10 min-w-full">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-slate-600 transition-colors flex items-center justify-between"
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <span>{option}</span>
                    {selectedFilter === option && (
                      <svg
                        className="w-4 h-4 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{
          maxHeight: "380px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="space-y-3 sm:space-y-4">
          {filteredActivities.length === 0 ? (
            <p className="text-gray-400 text-sm text-center mt-4">
              No recent activity.
            </p>
          ) : (
            filteredActivities.map((activity) => {
              const { date, time } = formatDateTime(activity.time);
              return (
                <div key={activity.id}>
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-slate-700/30 transition-colors">
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shrink-0 ${activity.color} ${activity.iconColor}`}
                    >
                      <span className="text-lg sm:text-xl">
                        {activity.icon}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-blue-300 text-sm sm:text-base truncate">
                            {activity.title}
                          </h3>
                          {activity.item_name && (
                            <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-1 sm:line-clamp-none">
                              {activity.item_name}
                            </p>
                          )}
                          {activity.item_category && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-slate-700/50 text-slate-300 rounded-md">
                              {activity.item_category}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">
                            {date}
                          </span>
                          <span className="text-xs text-gray-500 block">
                            {time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mx-3 sm:mx-4 h-px bg-slate-700/50"></div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
