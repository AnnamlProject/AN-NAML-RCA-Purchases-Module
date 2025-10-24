import React, { useMemo, useState } from "react";
import { listPRs, removePR } from "../lib/prStorage";
import { idr } from "../lib/currency";
import StatusPill from "../components/StatusPill";
import { PRStatus, PurchaseRequest } from "../types/purchases";

type Props = {
  onNewPR?: () => void;
  onOpenPR?: (id: string) => void;
  onCreatePO?: (pr: PurchaseRequest) => void;
};

export default function PRListPage({ onNewPR, onOpenPR, onCreatePO }: Props) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<PRStatus | "ALL">("ALL");
  const [refreshToken, setRefreshToken] = useState(0);

  const rows = useMemo(() => {
    let data = listPRs();
    if (status !== "ALL") data = data.filter((x) => x.status === status);
    if (q.trim()) {
      const s = q.trim().toLowerCase();
      data = data.filter((x) =>
        [
          x.number,
          x.schoolDivision,
          x.pic,
          x.purpose ?? "",
          x.shippingAddress,
        ]
          .join(" ")
          .toLowerCase()
          .includes(s)
      );
    }
    return data;
  }, [q, status, refreshToken]);

  const handleDelete = (id: string) => {
    if (!confirm("Hapus PR ini?")) return;
    removePR(id);
    setRefreshToken((n) => n + 1);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <h1 className="text-lg font-semibold">Purchase Requests</h1>
        <div className="ml-auto flex items-center gap-2">
          <input
            placeholder="Cari nomor / division / PIC…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm w-64"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="REVIEWED">Reviewed</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            className="rounded-lg border px-3 py-2 text-sm bg-white hover:bg-slate-50"
            onClick={() => setRefreshToken((n) => n + 1)}
            title="Reload"
          >
            Reload
          </button>
          {onNewPR && (
            <button
              className="rounded-lg px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700"
              onClick={onNewPR}
            >
              + New PR
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Request Number</th>
              <th className="px-3 py-2 text-left">Division</th>
              <th className="px-3 py-2 text-left">PIC</th>
              <th className="px-3 py-2 text-left">Date Request</th>
              <th className="px-3 py-2 text-left">Needed Date</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr className="border-t">
                <td className="px-3 py-4 text-slate-500 text-center" colSpan={9}>
                  Belum ada Purchase Request.
                </td>
              </tr>
            )}
            {rows.map((r, i) => (
              <tr key={r.id} className="border-t">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2 font-medium">{r.number}</td>
                <td className="px-3 py-2">{r.schoolDivision}</td>
                <td className="px-3 py-2">{r.pic}</td>
                <td className="px-3 py-2">{r.dateRequest}</td>
                <td className="px-3 py-2">{r.neededDate}</td>
                <td className="px-3 py-2">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-3 py-2 text-right">{idr(r.total || 0)}</td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    {onOpenPR && (
                      <button
                        className="border rounded px-2 py-1 text-sm hover:bg-slate-50"
                        onClick={() => onOpenPR(r.id)}
                      >
                        Open
                      </button>
                    )}
                    {onCreatePO && (
                      <button
                        className={`border rounded px-2 py-1 text-sm ${
                          r.status === "APPROVED"
                            ? "hover:bg-emerald-50"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        disabled={r.status !== "APPROVED"}
                        onClick={() => onCreatePO(r)}
                        title={
                          r.status === "APPROVED"
                            ? "Create PO from this PR"
                            : "Hanya PR Approved yang bisa dibuatkan PO"
                        }
                      >
                        Create PO
                      </button>
                    )}
                    <button
                      className="border rounded px-2 py-1 text-sm text-rose-600 hover:bg-rose-50"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
