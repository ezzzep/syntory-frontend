"use client";

import React, { useEffect, useState } from "react";
import { Bell, X, Check, Info, AlertTriangle } from "lucide-react";

import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "@/lib/api/notifications";

import { Notification, NotificationType } from "@/types/notification";


const getNotificationMeta = (type: NotificationType) => {
  switch (type) {
    case "market_update":
      return {
        icon: Info,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-500",
        badge: "Market Update",
      };

    case "inventory_alert":
      return {
        icon: AlertTriangle,
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-500",
        badge: "Low Stock",
      };

    case "price_alert":
      return {
        icon: AlertTriangle,
        color: "text-red-400",
        bg: "bg-red-400/10",
        border: "border-red-500",
        badge: "Price Alert",
      };

    default:
      return {
        icon: Info,
        color: "text-slate-400",
        bg: "bg-slate-400/10",
        border: "border-slate-600",
        badge: "System",
      };
  }
};


export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-slate-400">
            Market updates, alerts, and system activity
          </p>
        </header>

        {loading ? (
          <p className="text-center text-slate-400">Loading notifications…</p>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => {
              const {
                icon: Icon,
                color,
                bg,
                border,
                badge,
              } = getNotificationMeta(n.type);

              const isRead = !!n.is_read;

              return (
                <div
                  key={n.id}
                  className={`relative flex items-start gap-4 p-4 rounded-xl
                    border-l-4 ${border}
                    ${bg}
                    ${isRead ? "opacity-70" : ""}
                    transition-all group`}
                >
                  <div className={`p-2 rounded-full ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>

                  <div className="flex-1">
                    <p
                      className={`text-sm ${
                        isRead ? "text-slate-400" : "text-white font-medium"
                      }`}
                    >
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold ${color} ${bg}`}
                  >
                    {badge}
                  </span>

                  <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    {!isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="p-1.5 rounded-full bg-slate-700 hover:bg-slate-600"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-slate-300" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-1.5 rounded-full bg-slate-700 hover:bg-red-600"
                      title="Delete"
                    >
                      <X className="w-4 h-4 text-slate-300" />
                    </button>
                  </div>

                  {!isRead && (
                    <span className="absolute top-5 left-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
