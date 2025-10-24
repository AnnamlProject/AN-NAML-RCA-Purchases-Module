import React from "react";

// FIX: Generalize the StatusPill component to handle statuses from multiple modules (PR, PO, PI).
// The map now includes more statuses with uppercase keys for consistency.
const map: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-indigo-100 text-indigo-700",
  REVIEWED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
  PROCESSED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-stone-100 text-stone-700",
  PAID: "bg-teal-100 text-teal-700",
  OVERDUE: "bg-orange-100 text-orange-800",
};

// The component prop `status` is changed to `string` to accept various status values.
// It normalizes the input to uppercase to match the map keys.
export default function StatusPill({ status }: { status: string }) {
  const upperCaseStatus = status.toUpperCase();
  const className = map[upperCaseStatus] || "bg-gray-200 text-gray-800"; // Fallback for unknown statuses

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {upperCaseStatus}
    </span>
  );
}
