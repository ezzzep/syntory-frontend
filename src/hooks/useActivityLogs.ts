import { useState, useEffect, useCallback } from "react";
import { getActivityLogs } from "@/lib/api/activity";
import type { ActivityData } from "@/types/analytics";

interface RawActivityLog {
  id: number;
  action: string;
  name: string | null;
  subject_type: "supplier" | "inventory";
  subject_id: number;
  category: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changes: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

function getActionTitle(action: string, subjectType: "supplier" | "inventory") {
  const target = subjectType === "supplier" ? "Supplier" : "Item";

  switch (action.toLowerCase()) {
    case "created":
      return `Added ${target}`;
    case "updated":
      return `Updated ${target}`;
    case "deleted":
      return `Deleted ${target}`;
    default:
      return action.charAt(0).toUpperCase() + action.slice(1);
  }
}

function getAppearanceForActivity(
  action: string,
  category: string | null,
  categoryColorMap: Map<string, string>,
  categoryIconMap: Map<string, string>
) {
  const normalizedAction = action.toLowerCase();

  let icon = "📄";
  let color = "bg-blue-500/20";
  const iconColor = "text-blue-400";

  if (["created", "updated", "deleted"].includes(normalizedAction)) {
    if (category) {
      if (categoryColorMap.has(category)) {
        color = categoryColorMap.get(category)!;
      }
      if (categoryIconMap.has(category)) {
        icon = categoryIconMap.get(category)!;
      }
    }
  }

  return { icon, color, iconColor };
}

export function useActivityLogs(
  categoryColors: Record<string, string>,
  categoryIcons: Record<string, string>
) {
  const [logs, setLogs] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryColorMap = new Map(Object.entries(categoryColors));
  const categoryIconMap = new Map(Object.entries(categoryIcons));

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const rawLogs: RawActivityLog[] = await getActivityLogs();

      const mapped: ActivityData[] = rawLogs.map((log) => {
        const { icon, color, iconColor } = getAppearanceForActivity(
          log.action,
          log.category,
          categoryColorMap,
          categoryIconMap
        );

        return {
          id: log.id,
          title: getActionTitle(log.action, log.subject_type),
          icon,
          color,
          iconColor,
          action: log.action,
          name: log.name || undefined,
          category: log.category || undefined,
          time: log.created_at,
          changes: log.changes || null,
        };
      });

      setLogs(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, [categoryColorMap, categoryIconMap]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refetch();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [refetch]);

  return { logs, loading, error, refetch };
}
