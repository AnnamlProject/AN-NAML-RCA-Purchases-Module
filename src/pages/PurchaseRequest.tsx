
import React, { useMemo, useState, useEffect } from "react";
import { idr } from "../lib/currency";
import StatusPill from "../components/StatusPill";
import { PRItem, PRStatus, PurchaseRequest as PurchaseRequestType } from "../types/purchases";
import { getPR, saveOrUpdatePR } from "../lib/prStorage";

const blankItem = (): PRItem => ({
  id: crypto.randomUUID(),
  qty: 1,
  unit: "unit",
  taxCode: "PPN11",
});

type Props = {
  prId?: string;
  onBack: () => void;
};

export default function PurchaseRequest({ prId, onBack }: Props) {
  // Header PR
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
  const [status, setStatus] = useState<PRStatus>("DRAFT");
  const [reviewer, setReviewer] = useState("");
  const [approver, setApprover] = useState("");
  const [reviewerNotes, setReviewerNotes] = useState("");
  
  // Persistence IDs
  const [internalPrId] = useState(prId || crypto.randomUUID());
  const [createdAt, setCreatedAt] = useState<string>(new Date().toISOString());

  useEffect(() => {
    if (prId) {
      const existingPr = getPR(prId);
      if (existingPr) {
        setSchoolDivision(existingPr.schoolDivision);
        setPic(existingPr.pic);
        setDateOfUse(existingPr.dateOfUse);
        setPurpose(existingPr.purpose || "");
        setRequestNumber(existingPr.number);
        setAutoNumber(false);
        setDateRequest(existingPr.dateRequest);
        setNeededDate(existingPr.neededDate);
        setShippingAddress(existingPr.shippingAddress);
        setItems(existingPr.items);
        setStatus(existingPr.status);
        setReviewer(existingPr.reviewer || "");
        setApprover(existingPr.approver || "");
        setReviewerNotes(existingPr.reviewerNotes || "");
        setCreatedAt(existingPr.createdAt);
      }
    }
  }, [prId]);

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
    const newNum = `PR-${ymd}-${seq}`;
    setRequestNumber(newNum);
    return newNum;
  };

  const handleSave = (newStatus: PRStatus) => {
    if (newStatus === "SUBMITTED" && !canSubmit) {
      alert("Lengkapi field wajib dan isi item dengan benar.");
      return;
    }

    let currentRequestNumber = requestNumber;
    if (autoNumber && !currentRequestNumber) {
      currentRequestNumber = generateNumber();
    }

    if (!currentRequestNumber) {
        alert("Request Number is required.");
        return;
    }

    const now = new Date().toISOString();
    const pr: PurchaseRequestType = {
      id: internalPrId,
      number: currentRequestNumber,
      schoolDivision,
      pic,
      dateOfUse,
      purpose,
      dateRequest,
      neededDate,
      shippingAddress,
      items,
      subtotal,
      tax,
      total,
      status: newStatus,
      reviewer,
      approver,
      reviewerNotes,
      createdAt,
      updatedAt: now,
    };
    saveOrUpdatePR(pr);
    alert(newStatus === "DRAFT" ? "Saved as draft." : "Submitted for approval.");
    onBack();
  };

  const saveDraft = () => handleSave("DRAFT");
  const submitForApproval = () => handleSave("SUBMITTED");

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">{prId ? 'Edit Purchase Request' : 'New Purchase Request'}</h1>
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
            <input className="flex-1 border rounded-lg px-3 py-2" value={requestNumber} onChange={(e) => setRequestNumber(e.target.value)} disabled={autoNumber} placeholder="Auto-generated on save" />
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
                    <td className="px-2 py-1 text-right">{idr(line)}</td>
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
            <div className="flex justify-between py-0.5"><span>Subtotal</span><span>{idr(subtotal)}</span></div>
            <div className="flex justify-between py-0.5"><span>Total Tax</span><span>{idr(tax)}</span></div>
            <div className="flex justify-between py-0.5 border-t mt-1 pt-1 font-semibold"><span>Total</span><span>{idr(total)}</span></div>
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
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium">Reviewer Notes</label>
          <textarea className="w-full border rounded-lg px-3 py-2" rows={2} value={reviewerNotes} onChange={(e) => setReviewerNotes(e.target.value)} />
        </div>
      </div>

      {/* Footer actions */}
      <div className="mt-4 flex justify-end gap-2">
        <button className="border rounded-xl px-4 py-2" onClick={onBack}>Cancel</button>
        <button className="border rounded-xl px-4 py-2" onClick={saveDraft}>Save Draft</button>
        <button className={`rounded-xl px-4 py-2 text-white ${canSubmit ? "bg-indigo-600" : "bg-slate-400 cursor-not-allowed"}`} disabled={!canSubmit} onClick={submitForApproval}>
          Submit for Approval
        </button>
      </div>
    </div>
  );
}
