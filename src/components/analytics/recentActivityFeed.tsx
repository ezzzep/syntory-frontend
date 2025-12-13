"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useActivityLogs } from "@/hooks/useActivityLogs";

export default function RecentActivityFeed() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const categoryColors: Record<string, string> = {
    Appliances: "bg-blue-500/20",
    "Home & Living": "bg-green-500/20",
    Gadgets: "bg-purple-500/20",
    "Home Cleaning": "bg-orange-500/20",
  };

  const categoryIcons: Record<string, string> = {
    Appliances: "📺",
    "Home & Living": "🏠",
    Gadgets: "📱",
    "Home Cleaning": "🧹",
  };

  const { logs, loading, error } = useActivityLogs(
    categoryColors,
    categoryIcons
  );

  const uniqueCategories = useMemo(() => {
    return [
      ...new Set(logs.map((l) => l.category).filter((c): c is string => !!c)),
    ].sort();
  }, [logs]);

  const filteredLogs = selectedFilter
    ? logs.filter((l) => l.category === selectedFilter)
    : logs;

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return {
      date: date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      setShowScrollArrow(el.scrollTop === 0);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [filteredLogs]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading activity...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 flex flex-col h-full relative">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <div className="flex justify-between mb-4 flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            <button
              className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer ${
                selectedFilter === null
                  ? "bg-slate-700/40 text-white"
                  : "bg-slate-700/40 text-gray-300"
              }`}
              onClick={() => setSelectedFilter(null)}
            >
              All
            </button>

            {selectedFilter && (
              <div className="inline-flex items-center bg-slate-700/40 text-white text-sm px-3 py-1 rounded-lg">
                {selectedFilter}
                <button
                  className="ml-2 opacity-80 hover:opacity-100 cursor-pointer"
                  onClick={() => setSelectedFilter(null)}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {uniqueCategories.length > 0 && (
            <div className="relative">
              <button
                className="px-4 py-1 rounded-lg bg-slate-700/40 text-sm font-medium cursor-pointer"
                onClick={() => setIsDropdownOpen((p) => !p)}
              >
                Filter
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-slate-800 rounded-lg overflow-hidden z-10 shadow-lg">
                  {uniqueCategories.map((cat) => (
                    <button
                      key={cat}
                      className={`block w-full px-4 py-2 text-left hover:bg-slate-700 text-sm cursor-pointer ${
                        selectedFilter === cat
                          ? "bg-blue-600 text-white"
                          : "text-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedFilter(cat);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-3 hide-scrollbar"
          style={{ maxHeight: "calc(4 * 95px + 3 * 12px)" }}
        >
          {filteredLogs.length === 0 ? (
            <p className="text-center text-gray-400">No activity found.</p>
          ) : (
            filteredLogs.map((log) => {
              const { date, time } = formatDateTime(log.time);

              return (
                <div
                  key={log.id}
                  className="flex gap-4 p-3 rounded-xl hover:bg-slate-700/30"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      log.title.startsWith("Added")
                        ? "bg-blue-500/50"
                        : log.title.startsWith("Updated")
                        ? "bg-yellow-500/50"
                        : log.title.startsWith("Deleted")
                        ? "bg-red-500/50"
                        : log.color
                    } ${log.iconColor}`}
                  >
                    <span className="text-xl">{log.icon}</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-white">
                          {log.title}
                        </h3>
                        {log.name && (
                          <p className="text-sm text-gray-300">{log.name}</p>
                        )}
                        {log.category && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs bg-slate-700 text-gray-300 rounded-md">
                            {log.category}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-gray-500 text-right">
                        <div>{date}</div>
                        <div>{time}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {showScrollArrow && filteredLogs.length > 4 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-700/60 rounded-full flex items-center justify-center animate-bounce">
              ↓
            </div>
          )}
        </div>
      </div>
    </>
  );
}
