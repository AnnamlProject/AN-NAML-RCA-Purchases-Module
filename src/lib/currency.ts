// src/lib/currency.ts
export const idr = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    Number.isFinite(n) ? n : 0
  );
