// src/components/StatusPill.tsx
import React from "react";
import { PRStatus } from "../types/purchases";

const map: Record<PRStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-indigo-100 text-indigo-700",
  REVIEWED: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-rose-100 text-rose-700",
};

export default function StatusPill({ status }: { status: PRStatus }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>
      {status}
    </span>
  );
}
