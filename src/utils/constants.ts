import type { StatusConfig } from "../types/data";

export const STATUS_OPTIONS: Record<StatusConfig["id"], StatusConfig> = {
  completed: {
    id: "completed",
    label: "Completed",
    icon: "✅",
    colorClass: "text-green-700",
    colorBg: "emerald-400",
  },
  missed: {
    id: "missed",
    label: "Missed",
    icon: "❌",
    colorClass: "text-red-700",
    colorBg: "red-400",
  },
  pending: {
    id: "pending",
    label: "Pending",
    icon: "⌛",
    colorClass: "text-yellow-700",
    colorBg: "yellow-400",
  },
};

export const STATUS_LIST = Object.values(STATUS_OPTIONS);
