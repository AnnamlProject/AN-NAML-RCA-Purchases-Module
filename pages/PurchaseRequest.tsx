import React, { useMemo, useState } from "react";

type PRItem = {
  id: string;
  monthYear?: string;     // Month/Year for use
  name?: string;          // Item Name
  brand?: string;         // Merk / Type
  spec?: string;          // Specification
  qty?: number;
  unit?: string;
  price?: number;         // Price / Unit
  link?: string;          // Purchase Link
  userPic?: string;       // User / PIC
  location?: string;      // Location (Room)
  notes?: string;         // Notes
  taxCode?: "PPN11" | "NON";
};

type ApprovalStatus = "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "REJECTED";

const currency = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number.isFinite(n) ? n : 0);

const StatusPill: React.FC<{ status: ApprovalStatus }> = ({ status }) => {
  const map: Record<ApprovalStatus, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    SUBMITTED: "bg-indigo-100 text-indigo-700",
    REVIEWED: "bg-amber-100 text-amber-800",
    APPROVED: "bg-emerald-100 text-emerald-700",
    REJECTED: "bg-rose-100 text-rose-700",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status]}`}>{status}</span>;
};

const blankItem = (): PRItem => ({
  id: crypto.randomUUID(),
  qty: 1,
  unit: "unit",
  taxCode: "PPN11",
});

export default function PurchaseRequest() {
  // Header PR (tanpa Vendor)
  const [schoolDivision, setSchoolDivision] = useState("");
  const [pic, setPic] = useState("");
  const [dateOfUse, setDateOfUse] = useState<string>(new Date().toISOString().slice(0, 10));
  const [purpose, setPurpose] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [autoNumber, setAutoNumber] = useState(true);
  const [dateRequest, setDateRequest] = useState<string>(new Date().toISOString().slice(0, 10));
  const [neededDate, setNeededDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [shippingAddress, setShippingAddress] = useState("");

  // Items
  const [items, setItems] = useState<PRItem[]>([blankItem()]);
  const addRow = () => setItems((x) => [...x, blankItem()]);
  const removeRow = (id: string) => setItems((x) => x.filter((r) => r.id !== id));
  const patch = (id: string, patch: Partial<PRItem>) =>
    setItems((x) => x.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  // Approval
  const [status, setStatus] = useState<ApprovalStatus>("DRAFT");
  const [reviewer, setReviewer] = useState("");
  const [approver, setApprover] = useState("");
  const [reviewerNotes, setReviewerNotes] = useState("");

  // Totals
  const { subtotal, tax, total } = useMemo(() => {
    let sub = 0;
    let tx = 0;
    items.forEach((it) => {
      const line = (it.qty || 0) * (it.price || 0);
      sub += line;
      if (it.taxCode === "PPN11") tx += line * 0.11;
    });
    return { subtotal: sub, tax: tx, total: sub + tx };
  }, [items]);

  const canSubmit =
    schoolDivision &&
    pic &&
    dateOfUse &&
    neededDate &&
    shippingAddress &&
    items.length > 0 &&
    items.every((i) => i.name && (i.qty || 0) > 0 && i.unit && (i.price || 0) >= 0);

  const generateNumber = () => {
    const ymd = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const seq = String(Math.floor(Math.random() * 9999)).padStart(4, "0");
    setRequestNumber(`PR-${ymd}-${seq}`);
  };

  const saveDraft = () => {
    if (autoNumber && !requestNumber) generateNumber();
    setStatus("DRAFT");
    alert("Saved as draft (mock).");
  };

  const submitForApproval = () => {
    if (!canSubmit) return alert("Lengkapi field wajib dan isi item dengan benar.");
    if (autoNumber && !requestNumber) generateNumber();
    setStatus("SUBMITTED");
    alert("Submitted for approval (mock).");
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Purchase Request</h1>
        <StatusPill status={status} />
      </div>

      {/* Header */}
      <div className="grid md:grid-cols-2 gap-4 bg-white rounded-xl border p-4">
        <div>
          <label className="text-sm font-medium">School / Division *</label>
          <input className="w-full border rounded-lg px-3 py-2" value={schoolDivision} onChange={(e) => setSchoolDivision(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Person in Charge (PIC) *</label>
          <input className="w-full border rounded-lg px-3 py-2" value={pic} onChange={(e) => setPic(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Date of Use *</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" value={dateOfUse} onChange={(e) => setDateOfUse(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Purpose / Keperluan</label>
          <input className="w-full border rounded-lg px-3 py-2" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Request Number *</label>
          <div className="flex gap-2">
            <input className="flex-1 border rounded-lg px-3 py-2" value={requestNumber} onChange={(e) => setRequestNumber(e.target.value)} disabled={autoNumber} placeholder="Auto" />
            <label className="text-xs flex items-center gap-1">
              <input type="checkbox" checked={autoNumber} onChange={(e) => setAutoNumber(e.target.checked)} /> Auto
            </label>
            <button type="button" className="border rounded-lg px-2" onClick={generateNumber}>Generate</button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Date Request *</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" value={dateRequest} onChange={(e) => setDateRequest(e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Needed Date *</label>
          <input type="date" className="w-full border rounded-lg px-3 py-2" value={neededDate} onChange={(e) => setNeededDate(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Shipping Address *</label>
          <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
        </div>
      </div>

      {/* Items */}
      <div className="mt-4 bg-white rounded-xl border p-4">
        <div className="mb-2 font-medium">Items Submission</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-2 py-1 text-left">Month/Year</th>
                <th className="px-2 py-1 text-left">Item Name</th>
                <th className="px-2 py-1 text-left">Merk/Type</th>
                <th className="px-2 py-1 text-left">Specification</th>
                <th className="px-2 py-1 text-right">Qty</th>
                <th className="px-2 py-1 text-left">Unit</th>
                <th className="px-2 py-1 text-right">Price/Unit</th>
                <th className="px-2 py-1 text-right">Total</th>
                <th className="px-2 py-1 text-left">Link</th>
                <th className="px-2 py-1 text-left">User/PIC</th>
                <th className="px-2 py-1 text-left">Location</th>
                <th className="px-2 py-1 text-left">Notes</th>
                <th className="px-2 py-1 text-left">Tax</th>
                <th className="px-2 py-1">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => {
                const line = (it.qty || 0) * (it.price || 0);
                return (
                  <tr key={it.id} className="border-t">
                    <td className="px-2 py-1"><input className="w-36 border rounded px-2 py-1" value={it.monthYear || ""} onChange={(e) => patch(it.id, { monthYear: e.target.value })} placeholder="October 2025" /></td>
                    <td className="px-2 py-1"><input className="w-44 border rounded px-2 py-1" value={it.name || ""} onChange={(e) => patch(it.id, { name: e.target.value })} /></td>
                    <td className="px-2 py-1"><input className="w-40 border rounded px-2 py-1" value={it.brand || ""} onChange={(e) => patch(it.id, { brand: e.target.value })} /></td>
                    <td className="px-2 py-1"><input className="w-44 border rounded px-2 py-1" value={it.spec || ""} onChange={(e) => patch(it.id, { spec: e.target.value })} /></td>
                    <td className="px-2 py-1 text-right"><input type="number" min={0} className="w-20 border rounded px-2 py-1 text-right" value={it.qty ?? 0} onChange={(e) => patch(it.id, { qty: Number(e.target.value) })} /></td>
                    <td className="px-2 py-1"><input className="w-20 border rounded px-2 py-1" value={it.unit || ""} onChange={(e) => patch(it.id, { unit: e.target.value })} /></td>
                    <td className="px-2 py-1 text-right"><input type="number" min={0} className="w-28 border rounded px-2 py-1 text-right" value={it.price ?? 0} onChange={(e) => patch(it.id, { price: Number(e.target.value) })} /></td>
                    <td className="px-2 py-1 text-right">{currency(line)}</td>
                    <td className="px-2 py-1"><input className="w-56 border rounded px-2 py-1" value={it.link || ""} onChange={(e) => patch(it.id, { link: e.target.value })} placeholder="https://…" /></td>
                    <td className="px-2 py-1"><input className="w-36 border rounded px-2 py-1" value={it.userPic || ""} onChange={(e) => patch(it.id, { userPic: e.target.value })} /></td>
                    <td className="px-2 py-1"><input className="w-36 border rounded px-2 py-1" value={it.location || ""} onChange={(e) => patch(it.id, { location: e.target.value })} /></td>
                    <td className="px-2 py-1"><input className="w-36 border rounded px-2 py-1" value={it.notes || ""} onChange={(e) => patch(it.id, { notes: e.target.value })} /></td>
                    <td className="px-2 py-1">
                      <select className="border rounded px-2 py-1" value={it.taxCode} onChange={(e) => patch(it.id, { taxCode: e.target.value as PRItem["taxCode"] })}>
                        <option value="PPN11">PPN 11%</option>
                        <option value="NON">Non-Tax</option>
                      </select>
                    </td>
                    <td className="px-2 py-1 text-center">
                      <button className="border rounded px-2 py-1 text-rose-600" onClick={() => removeRow(it.id)}>×</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <button className="border rounded-lg px-3 py-2" onClick={addRow}>+ Tambah Baris</button>
          <div className="w-full max-w-sm ml-auto text-sm">
            <div className="flex justify-between py-0.5"><span>Subtotal</span><span>{currency(subtotal)}</span></div>
            <div className="flex justify-between py-0.5"><span>Total Tax</span><span>{currency(tax)}</span></div>
            <div className="flex justify-between py-0.5 border-t mt-1 pt-1 font-semibold"><span>Total</span><span>{currency(total)}</span></div>
          </div>
        </div>
      </div>

      {/* Approval */}
      <div className="mt-4 bg-white rounded-xl border p-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Reviewer</label>
            <input className="w-full border rounded-lg px-3 py-2" value={reviewer} onChange={(e) => setReviewer(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Approver</label>
            <input className="w-full border rounded-lg px-3 py-2" value={approver} onChange={(e) => setApprover(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            <button className="border rounded-lg px-3 py-2" onClick={() => setStatus("REVIEWED")}>Mark Reviewed</button>
            <button className="border rounded-lg px-3 py-2" onClick={() => setStatus("APPROVED")}>Approve</button>
            <button className="border rounded-lg px-3 py-2" onClick={() => setStatus("REJECTED")}>Reject</button>
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium">Reviewer Notes</label>
          <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={reviewerNotes} onChange={(e) => setReviewerNotes(e.target.value)} />
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex justify-end gap-2">
        <button className="border rounded-xl px-4 py-2">Cancel</button>
        <button className="border rounded-xl px-4 py-2" onClick={saveDraft}>Save Draft</button>
        <button className={`rounded-xl px-4 py-2 text-white ${canSubmit ? "bg-indigo-600" : "bg-slate-400 cursor-not-allowed"}`} disabled={!canSubmit} onClick={submitForApproval}>
          Submit for Approval
        </button>
      </div>
    </div>
  );
}
