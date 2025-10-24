export interface PurchaseRequestItem {
  id: string;
  monthYearForUse: string;
  itemName: string;
  merkType: string;
  specification: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  total: number;
  itemPhoto?: string; // Optional field for image URL or placeholder
  purchaseLink: string;
  userPIC: string;
  location: string;
  notes: string;
}

export type PRStatus = 'Draft' | 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected';

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  division: string;
  pic: string;
  dateOfUse: string;
  purpose: string;
  dateRequest: string;
  neededDate: string;
  shippingAddress: string;
  status: PRStatus;
  items: PurchaseRequestItem[];
  totalAmount: number;
  reviewer?: string;
  approver?: string;
  earlyPaymentTerms?: string;
  messages?: string;
  reviewerNotes?: string;
}

export const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: 'pr_001',
    requestNumber: 'PR-20241015-0001',
    division: 'Finance – Office',
    pic: 'Nike Eka F',
    dateOfUse: '2025-10-20',
    purpose: 'Office supplies for new finance staff',
    dateRequest: '2024-10-15',
    neededDate: '2024-10-30',
    shippingAddress: 'RCA Head Office, Jakarta',
    status: 'Approved',
    items: [
      { id: 'item_1', monthYearForUse: 'October 2025', itemName: 'Tempat Tissue', merkType: 'Informa', specification: 'White', quantity: 1, unit: 'unit', pricePerUnit: 129000, total: 129000, itemPhoto: '-', purchaseLink: '#', userPIC: 'Nike Eka F', location: 'R. Meeting Finance', notes: 'Non-Asset' },
      { id: 'item_2', monthYearForUse: 'October 2025', itemName: 'Laptop Stand', merkType: 'Maxi BGS', specification: 'Silver', quantity: 1, unit: 'unit', pricePerUnit: 145000, total: 145000, itemPhoto: '-', purchaseLink: '#', userPIC: 'Nike Eka F', location: 'R. Head of Finance', notes: 'Non-Asset' },
      { id: 'item_3', monthYearForUse: 'October 2025', itemName: 'Laptop Holder', merkType: 'SUIRGE', specification: 'Black', quantity: 1, unit: 'pcs', pricePerUnit: 61000, total: 61000, itemPhoto: '-', purchaseLink: '#', userPIC: 'Aldienda', location: 'R. Finance', notes: 'Non-Asset' },
    ],
    totalAmount: 335000,
    reviewer: 'John Doe',
    approver: 'Jane Smith',
    earlyPaymentTerms: 'Net 30',
    messages: 'Please ensure items are delivered to the 5th floor reception.',
    reviewerNotes: 'Approved based on budget availability.'
  },
  {
    id: 'pr_002',
    requestNumber: 'PR-20241014-0021',
    division: 'IT Department',
    pic: 'Budi Santoso',
    dateOfUse: '2024-11-01',
    purpose: 'Server upgrade components',
    dateRequest: '2024-10-14',
    neededDate: '2024-10-28',
    shippingAddress: 'RCA Data Center, Jakarta',
    status: 'Submitted',
    items: [
       { id: 'item_4', monthYearForUse: 'November 2024', itemName: 'RAM 32GB DDR5', merkType: 'Corsair', specification: 'Vengeance RGB', quantity: 4, unit: 'pcs', pricePerUnit: 1500000, total: 6000000, itemPhoto: '-', purchaseLink: '#', userPIC: 'Budi S.', location: 'Server Rack 3', notes: 'Asset' },
    ],
    totalAmount: 6000000,
    reviewer: 'John Doe',
    reviewerNotes: 'Waiting for vendor quotation to proceed.'
  },
  {
    id: 'pr_003',
    requestNumber: 'PR-20241012-0015',
    division: 'Marketing',
    pic: 'Siti Aminah',
    dateOfUse: '2024-10-25',
    purpose: 'Social media campaign materials',
    dateRequest: '2024-10-12',
    neededDate: '2024-10-22',
    shippingAddress: 'RCA Head Office, Jakarta',
    status: 'Draft',
    items: [],
    totalAmount: 0,
  },
    {
    id: 'pr_004',
    requestNumber: 'PR-20241011-0010',
    division: 'HRD',
    pic: 'Rahmat Hidayat',
    dateOfUse: '2024-11-15',
    purpose: 'Onboarding kit for new hires',
    dateRequest: '2024-10-11',
    neededDate: '2024-11-01',
    shippingAddress: 'RCA Head Office, Jakarta',
    status: 'Rejected',
    items: [
       { id: 'item_5', monthYearForUse: 'November 2024', itemName: 'Custom Mugs', merkType: 'Local Print', specification: 'With company logo', quantity: 50, unit: 'pcs', pricePerUnit: 45000, total: 2250000, itemPhoto: '-', purchaseLink: '#', userPIC: 'Rahmat H.', location: 'HRD Storage', notes: 'Non-Asset' },
    ],
    totalAmount: 2250000,
    reviewer: 'John Doe',
    approver: 'Jane Smith',
    reviewerNotes: 'Rejected. Vendor quality does not meet our standard. Please find an alternative.',
  },
];

// --- Vendor Data ---

export interface Vendor {
  id: string;
  name: string;
  paymentTerms: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
}

export const mockVendors: Vendor[] = [
  { id: 'ven_001', name: 'Informa Furnishings', paymentTerms: 'TRANSFER 14D', address: 'Jl. Gatot Subroto No. 12, Jakarta', contactPerson: 'Bambang P.', email: 'sales@informa.co.id', phone: '021-555-0101', status: 'Active' },
  { id: 'ven_002', name: 'Suirge Tech', paymentTerms: 'PAYLATER', address: 'Harco Mangga Dua, Lt. 3, Jakarta', contactPerson: 'Cynthia L.', email: 'support@suirge.tech', phone: '021-612-8888', status: 'Active' },
  { id: 'ven_003', name: 'Corsair Components', paymentTerms: 'TRANSFER 7D', address: 'Jl. Pahlawan No. 45, Bandung', contactPerson: 'David W.', email: 'order@corsair-id.com', phone: '022-123-4567', status: 'Active' },
  { id: 'ven_004', name: 'Local Print Shop', paymentTerms: 'COD', address: 'Jl. Percetakan Negara No. 9, Jakarta', contactPerson: 'Ahmad S.', email: 'info@localprint.id', phone: '021-420-1122', status: 'Inactive' },
];


// --- Purchase Order Data ---

export interface PurchaseOrderItem {
  id: string; 
  itemName: string;
  orderQty: number;
  unit: string;
  description: string;
  price: number;
  discount: number;
  tax: string;
  taxAmt: number;
  amount: number;
  account: string;
  notes: string;
}

export type POStatus = 'Draft' | 'Processed' | 'Cancelled';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  sourceRequest: string;
  vendor: string;
  paymentMethod: string;
  locationInventory: string;
  dateOrder: string;
  shippingDate: string;
  shippingAddress: string;
  status: POStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  totalTax: number;
  freight: number;
  grandTotal: number;
  earlyPaymentTerms?: string;
  messages?: string;
}

export const mockPurchaseOrders: PurchaseOrder[] = [
    {
        id: 'po_001',
        orderNumber: 'PO-20241016-0001',
        sourceRequest: 'PR-20241015-0001',
        vendor: 'Informa Furnishings',
        paymentMethod: 'TRANSFER 14D',
        locationInventory: 'Main Office Storage',
        dateOrder: '2024-10-16',
        shippingDate: '2024-10-25',
        shippingAddress: 'RCA Head Office, Jakarta',
        status: 'Processed',
        items: [
            { id: 'item_1', itemName: 'Tempat Tissue', orderQty: 1, unit: 'unit', description: 'White', price: 129000, discount: 0, tax: 'PPN 11%', taxAmt: 14190, amount: 143190, account: 'Office Supplies', notes: 'Non-Asset' },
            { id: 'item_2', itemName: 'Laptop Stand', orderQty: 1, unit: 'unit', description: 'Silver', price: 145000, discount: 0, tax: 'PPN 11%', taxAmt: 15950, amount: 160950, account: 'Office Supplies', notes: 'Non-Asset' },
        ],
        subtotal: 274000,
        totalTax: 30140,
        freight: 25000,
        grandTotal: 329140,
        earlyPaymentTerms: 'Net 30',
        messages: 'Please deliver between 9 AM - 4 PM.'
    },
    {
        id: 'po_002',
        orderNumber: 'PO-20241016-0002',
        sourceRequest: 'PR-20241015-0001',
        vendor: 'Suirge Tech',
        paymentMethod: 'PAYLATER',
        locationInventory: 'Main Office Storage',
        dateOrder: '2024-10-16',
        shippingDate: '2024-10-22',
        shippingAddress: 'RCA Head Office, Jakarta',
        status: 'Draft',
        items: [
             { id: 'item_3', itemName: 'Laptop Holder', orderQty: 1, unit: 'pcs', description: 'Black', price: 61000, discount: 0, tax: 'PPN 11%', taxAmt: 6710, amount: 67710, account: 'Office Supplies', notes: 'Non-Asset' },
        ],
        subtotal: 61000,
        totalTax: 6710,
        freight: 15000,
        grandTotal: 82710,
        earlyPaymentTerms: 'Net 30',
    }
];

// --- Purchase Invoice Data ---

export interface PurchaseInvoiceItem {
  id: string;
  itemNumber: string;
  qty: number;
  order: number;
  backOrder: number;
  unit: string;
  description: string;
  price: number;
  discount: number;
  vat: string;
  vatValue: number;
  amount: number;
  account: string;
  specpose: string;
}

export type PIStatus = 'Draft' | 'Submitted' | 'Paid' | 'Overdue' | 'Cancelled';

export interface PurchaseInvoice {
  id: string;
  invoiceNumber: string;
  sourceOrder: string;
  vendor: string;
  paymentMethod: string;
  locationInventory: string;
  invoiceDate: string;
  shippingDate: string;
  shippingAddress: string;
  status: PIStatus;
  items: PurchaseInvoiceItem[];
  subtotal: number;
  tax: number;
  freight: number;
  total: number;
  notes?: string;
  paymentDate?: string;
}

export const mockPurchaseInvoices: PurchaseInvoice[] = [
    {
        id: 'pi_001',
        invoiceNumber: 'PI-20241026-0001',
        sourceOrder: 'PO-20241016-0001',
        vendor: 'Informa Furnishings',
        paymentMethod: 'TRANSFER 14D',
        locationInventory: 'Main Office Storage',
        invoiceDate: '2024-10-26',
        shippingDate: '2024-10-25',
        shippingAddress: 'RCA Head Office, Jakarta',
        status: 'Submitted',
        items: [
            { id: 'item_1', itemNumber: '10002', qty: 1, order: 1, backOrder: 0, unit: 'unit', description: 'Tempat Tissue - White', price: 129000, discount: 0, vat: 'PPN 11%', vatValue: 14190, amount: 143190, account: 'Office Supplies', specpose: 'Non-Asset' },
            { id: 'item_2', itemNumber: '10001', qty: 1, order: 1, backOrder: 0, unit: 'unit', description: 'Laptop Stand - Silver', price: 145000, discount: 0, vat: 'PPN 11%', vatValue: 15950, amount: 160950, account: 'Office Supplies', specpose: 'Non-Asset' },
        ],
        subtotal: 274000,
        tax: 30140,
        freight: 25000,
        total: 329140,
        notes: 'Payment due by November 9, 2024.'
    }
];

// --- Chart of Accounts Data ---
export interface Account {
    id: string;
    code: string;
    name: string;
}

export const mockChartOfAccounts: Account[] = [
    { id: 'acc_01', code: '1101', name: 'Cash' },
    { id: 'acc_02', code: '1201', name: 'Accounts Receivable' },
    { id: 'acc_03', code: '1401', name: 'Inventory Asset' },
    { id: 'acc_04', code: '2101', name: 'Accounts Payable' },
    { id: 'acc_05', code: '4101', name: 'Sales Revenue' },
    { id: 'acc_06', code: '5101', name: 'Cost of Goods Sold (COGS)' },
    { id: 'acc_07', code: '5105', name: 'Purchase Price Variance' },
    { id: 'acc_08', code: '6101', name: 'Office Supplies Expense' },
];

// --- Inventory Data ---
export type ItemType = 'Inventory' | 'Service';

export interface InventoryItem {
    id: string;
    itemNumber: string;
    itemName: string;
    type: ItemType;
    status: 'Active' | 'Archived';
    
    // Quantities Tab
    quantitiesPerLocation: { location: string; onHandQuantity: number; onHandValue: number; }[];

    // Units Tab
    units: {
        stockingUom: string;
        sellingUomSameAsStocking: boolean;
        sellingUom: string;
        sellingRelationship: string; // e.g., "1 box = 12 pcs"
        buyingUomSameAsStocking: boolean;
        buyingUom: string;
        buyingRelationship: string;
    };

    // Pricing Tab
    pricing: { listName: string; price: number; }[];
    
    // Vendors Tab
    preferredVendorId: string;
    
    // Linked Account Tab
    linkedAccounts: {
        assetAccountId: string;
        revenueAccountId: string;
        cogsAccountId: string;
        varianceAccountId: string;
    };
    
    // Build (BOM) Tab
    buildItems: { itemId: string; unit: string; description: string; quantity: number; }[];

    // Taxes Tab
    taxes: {
        ppn11: boolean;
        exemptPpn: boolean;
    };

    // Description Tab
    description: string;

    // Picture Tab
    picture: {
        main: string;
        thumbnail: string;
    }
}

export const mockInventoryItems: InventoryItem[] = [
    { 
        id: 'inv_001', 
        itemNumber: '10001', 
        itemName: 'Laptop Stand', 
        type: 'Inventory', 
        status: 'Active',
        quantitiesPerLocation: [
            { location: 'Main Office Storage', onHandQuantity: 15, onHandValue: 2175000 },
            { location: 'IT Storage', onHandQuantity: 5, onHandValue: 725000 },
        ],
        units: {
            stockingUom: 'unit',
            sellingUomSameAsStocking: true, sellingUom: 'unit', sellingRelationship: '',
            buyingUomSameAsStocking: true, buyingUom: 'unit', buyingRelationship: '',
        },
        pricing: [
            { listName: 'Reguler', price: 165000 },
            { listName: 'Preferred', price: 150000 },
            { listName: 'Web Price', price: 175000 },
        ],
        preferredVendorId: 'ven_002',
        linkedAccounts: {
            assetAccountId: 'acc_03',
            revenueAccountId: 'acc_05',
            cogsAccountId: 'acc_06',
            varianceAccountId: 'acc_07',
        },
        buildItems: [],
        taxes: { ppn11: true, exemptPpn: false },
        description: 'Ergonomic aluminum laptop stand for better posture.',
        picture: { main: '', thumbnail: '' }
    },
    { 
        id: 'inv_002', 
        itemNumber: '10002', 
        itemName: 'Tempat Tissue', 
        type: 'Inventory', 
        status: 'Active',
        quantitiesPerLocation: [{ location: 'Main Office Storage', onHandQuantity: 30, onHandValue: 3870000 }],
        units: {
            stockingUom: 'pcs',
            sellingUomSameAsStocking: false, sellingUom: 'box', sellingRelationship: '1 box = 12 pcs',
            buyingUomSameAsStocking: false, buyingUom: 'carton', buyingRelationship: '1 carton = 48 pcs',
        },
        pricing: [{ listName: 'Reguler', price: 135000 }],
        preferredVendorId: 'ven_001',
        linkedAccounts: { assetAccountId: 'acc_03', revenueAccountId: 'acc_05', cogsAccountId: 'acc_08', varianceAccountId: 'acc_07'},
        buildItems: [],
        taxes: { ppn11: true, exemptPpn: false },
        description: 'White minimalist tissue box holder.',
        picture: { main: '', thumbnail: '' }
    },
    { 
        id: 'inv_005', 
        itemNumber: '30001', 
        itemName: 'Graphic Design Service', 
        type: 'Service', 
        status: 'Active',
        quantitiesPerLocation: [],
        units: {
            stockingUom: 'hour',
            sellingUomSameAsStocking: true, sellingUom: 'hour', sellingRelationship: '',
            buyingUomSameAsStocking: true, buyingUom: 'hour', buyingRelationship: '',
        },
        pricing: [{ listName: 'Reguler', price: 250000 }],
        preferredVendorId: '',
        linkedAccounts: { assetAccountId: '', revenueAccountId: 'acc_05', cogsAccountId: 'acc_06', varianceAccountId: ''},
        buildItems: [],
        taxes: { ppn11: true, exemptPpn: false },
        description: 'Graphic design services for marketing materials, charged per hour.',
        picture: { main: '', thumbnail: '' }
    },
];