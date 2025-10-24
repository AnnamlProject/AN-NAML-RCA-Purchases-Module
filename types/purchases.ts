export type PRStatus = "DRAFT" | "SUBMITTED" | "REVIEWED" | "APPROVED" | "REJECTED";

export type PRItem = {
  id: string;
  monthYear?: string;
  name?: string;
  brand?: string;
  spec?: string;
  qty?: number;
  unit?: string;
  price?: number;
  link?: string;
  userPic?: string;
  location?: string;
  notes?: string;
  taxCode?: "PPN11" | "NON";
};

export type PurchaseRequest = {
  id: string;
  number: string; // PR-YYYYMMDD-XXXX
  schoolDivision: string;
  pic: string;
  dateOfUse: string;     // YYYY-MM-DD
  purpose?: string;
  dateRequest: string;   // YYYY-MM-DD
  neededDate: string;    // YYYY-MM-DD
  shippingAddress: string;
  items: PRItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: PRStatus;
  reviewer?: string;
  approver?: string;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
};
