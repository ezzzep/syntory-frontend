// src/pages/NotificationsPage.tsx
"use client";

import React, { useState } from "react";
import {
  Bell,
  X,
  Check,
  Heart,
  MessageCircle,
  UserPlus,
  Info,
  AlertTriangle,
} from "lucide-react";

// --- TypeScript Type Definitions ---
// This defines the shape of our data, preventing errors.

interface User {
  name: string;
  avatarUrl: string;
}

interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "system" | "alert";
  user: User | null;
  content: string;
  timestamp: string;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

// --- Mock Data for Realism ---
// We tell TypeScript that this array conforms to our 'Notification' type.
const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "like",
    user: {
      name: "Alex Rivera",
      avatarUrl: "https://i.pravatar.cc/150?img=32",
    },
    content: 'liked your post "My new project setup..."',
    timestamp: "2 minutes ago",
    read: false,
  },
  {
    id: 2,
    type: "comment",
    user: { name: "Sam Kim", avatarUrl: "https://i.pravatar.cc/150?img=47" },
    content: 'commented: "This is a fantastic breakdown, thanks for sharing!"',
    timestamp: "15 minutes ago",
    read: false,
  },
  {
    id: 3,
    type: "follow",
    user: { name: "Casey Chen", avatarUrl: "https://i.pravatar.cc/150?img=12" },
    content: "started following you.",
    timestamp: "1 hour ago",
    read: true,
  },
  {
    id: 4,
    type: "system",
    user: null, // System notifications don't have a user
    content: "Your monthly report is ready to view.",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: 5,
    type: "alert",
    user: {
      name: "Jordan Blake",
      avatarUrl: "https://i.pravatar.cc/150?img=68",
    },
    content: "mentioned you in a comment.",
    timestamp: "5 hours ago",
    read: false,
  },
];

// --- Helper for Notification Icons & Colors ---
const getNotificationMeta = (type: Notification["type"]) => {
  switch (type) {
    case "like":
      return { icon: Heart, color: "text-red-400", bgColor: "bg-red-400/10" };
    case "comment":
      return {
        icon: MessageCircle,
        color: "text-blue-400",
        bgColor: "bg-blue-400/10",
      };
    case "follow":
      return {
        icon: UserPlus,
        color: "text-green-400",
        bgColor: "bg-green-400/10",
      };
    case "alert":
      return {
        icon: AlertTriangle,
        color: "text-yellow-400",
        bgColor: "bg-yellow-400/10",
      };
    case "system":
    default:
      return {
        icon: Info,
        color: "text-slate-400",
        bgColor: "bg-slate-400/10",
      };
  }
};

// --- Individual Notification Item Component ---
// We use React.FC with our defined props type.
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const { icon: Icon, color, bgColor } = getNotificationMeta(notification.type);
  const isRead = notification.read;

  return (
    <div
      className={`
        relative flex items-start gap-4 p-4 rounded-lg ring-1 ring-white/10
        transition-all duration-300 ease-out
        ${isRead ? "bg-slate-800/40 opacity-75" : "bg-slate-800/60 shadow-lg"}
        hover:scale-[1.02] hover:bg-slate-800/70 hover:shadow-xl hover:ring-white/20
        group
      `}
    >
      {/* Notification Icon */}
      <div className={`p-2 rounded-full ${bgColor} flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>

      {/* User Avatar or System Icon */}
      {notification.user ? (
        <img
          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700"
          src={notification.user.avatarUrl}
          alt={`${notification.user.name}'s avatar`}
        />
      ) : (
        <div className="p-2 rounded-full bg-slate-700 flex-shrink-0">
          <Bell className="w-6 h-6 text-slate-400" />
        </div>
      )}

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">
          {notification.user && (
            <span className="font-semibold">{notification.user.name}</span>
          )}{" "}
          <span className="text-slate-300">{notification.content}</span>
        </p>
        <p className="text-slate-500 text-xs mt-1">{notification.timestamp}</p>
      </div>

      {/* Action Buttons - visible on hover */}
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onMarkAsRead(notification.id)}
          className="p-1.5 rounded-full bg-slate-700/50 hover:bg-slate-600/50 transition-colors"
          title={isRead ? "Mark as unread" : "Mark as read"}
        >
          <Check
            className={`w-4 h-4 ${
              isRead ? "text-slate-500" : "text-slate-300"
            }`}
          />
        </button>
        <button
          onClick={() => onDelete(notification.id)}
          className="p-1.5 rounded-full bg-slate-700/50 hover:bg-red-600/50 transition-colors"
          title="Delete notification"
        >
          <X className="w-4 h-4 text-slate-300 hover:text-red-300" />
        </button>
      </div>

      {/* Unread indicator dot */}
      {!isRead && (
        <div className="absolute top-5 left-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

// --- Main Notifications Page Component ---
export default function NotificationsPage() {
  // We type the state to be an array of our 'Notification' objects.
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  // The 'id' parameter is now explicitly typed as a 'number'.
  const handleMarkAsRead = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
  };

  const handleDelete = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== id)
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-slate-400">
            Stay updated with your latest activity.
          </p>
        </header>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">You&apos;re all caught up!</p>
              <p className="text-slate-500 text-sm">
                No new notifications at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
