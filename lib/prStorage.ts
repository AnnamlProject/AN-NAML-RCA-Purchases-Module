import { PurchaseRequest } from "../types/purchases";

const KEY = "rca.pr.v1";

function read(): PurchaseRequest[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function write(list: PurchaseRequest[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function listPRs(): PurchaseRequest[] {
  return read().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export function getPR(id: string): PurchaseRequest | undefined {
  return read().find((x) => x.id === id);
}

export function saveOrUpdatePR(pr: PurchaseRequest) {
  const list = read();
  const idx = list.findIndex((x) => x.id === pr.id);
  if (idx >= 0) list[idx] = pr;
  else list.unshift(pr);
  write(list);
}

export function removePR(id: string) {
  const list = read().filter((x) => x.id !== id);
  write(list);
}
