
export const PROMPT_TEMPLATE = `
You are a Lead Solutions Architect and expert React developer specializing in building scalable and maintainable ERP systems. Your task is to analyze the provided System Guidelines for the AN-NAML / RCA Purchases Module and generate a comprehensive technical and architectural plan.

Your response MUST be a detailed, actionable plan formatted in Markdown. The plan should serve as a blueprint for developing and enhancing the purchasing workflow (Purchase Request -> Purchase Order -> Purchase Invoice).

Please structure your response into the following sections:

1.  **Data Architecture & Models:**
    *   Provide **TypeScript interfaces** for the primary entities: \`PurchaseRequest\`, \`PurchaseOrder\`, \`PurchaseInvoice\`, \`Vendor\`, and \`InventoryItem\`.
    *   Create a **Mermaid.js entity relationship diagram** illustrating the connections between these models.
    *   Explain the key relationships and cardinality (e.g., one-to-many).

2.  **Frontend Component Architecture:**
    *   Propose a hierarchical breakdown of React components (e.g., Page, Container, Presentational).
    *   For key components, define their primary responsibilities and suggested props.
    *   Identify reusable components that can be shared across the application (e.g., \`StatusPill\`, \`ItemsTable\`, \`FormSection\`).

3.  **UX & Workflow Analysis:**
    *   Detail the step-by-step user flow for the complete purchasing lifecycle.
    *   Focus on the state transitions (e.g., 'Draft' -> 'Submitted' -> 'Reviewed' -> 'Approved').
    *   Suggest UI/UX improvements to streamline data entry and user decision-making.

4.  **Module Integration Strategy:**
    *   Outline how the core purchasing modules will integrate with **Inventory**, **Vendor Management**, and future **Payment** modules.
    *   Describe the data flow between these modules (e.g., how a PO update affects inventory levels).

5.  **AI-Powered Feature Enhancements:**
    *   Propose 3-5 concrete AI features that could be built on top of this system.
    *   Examples: Predictive cost analysis, automated vendor recommendation based on item history, anomaly detection in purchase requests.

6.  **Mock API & Data Layer:**
    *   Define the essential **RESTful API endpoints** (\`GET\`, \`POST\`, \`PATCH\`) for each module.
    *   Provide example request/response payloads for key operations like creating a PR or processing a PO.

7.  **UI/UX Design Concept:**
    *   Describe a cohesive UI concept using **TailwindCSS**.
    *   Specify a color palette for statuses (e.g., Draft, Approved, Rejected, Paid) and UI elements (buttons, inputs).
    *   Describe key interaction states (hover, focus, disabled) for interactive elements.

8.  **Scalability & Best Practices:**
    *   Provide recommendations for state management (e.g., React Context, Zustand, Redux).
    *   Suggest best practices for code organization, modularity, and ensuring long-term maintainability.

### System Guidelines
<insert Guidelines.md content here>
`;

export const INITIAL_GUIDELINES = `
# Guidelines.md — Purchase Request & Purchase Order (Aligned for AN-NAML / RCA)

## 1. Overview

Purchase Request (PR) adalah **permintaan pembelian barang** dari unit/divisi ke Unit Purchasing. Form PR tidak lagi memerlukan input *Vendor* karena pemilihan vendor dilakukan pada tahap **Purchase Order (PO)**.

Siklus pembelian terdiri dari:

*   **Purchase Request (PR)** — Permintaan dari unit ke Purchasing.
*   **Purchase Order (PO)** — Pembuatan order resmi ke vendor.
*   **Purchase Invoice (PI)** — Tagihan dan pencatatan pembayaran vendor.

---

## 2. Purchase Request — Structure & Fields

### Header Information

| Field                      | Description                                         |
| -------------------------- | --------------------------------------------------- |
| **School / Division**      | Unit pengaju permintaan (contoh: Finance – Office). |
| **Person in Charge (PIC)** | Penanggung jawab pengajuan (contoh: Nike Eka F).    |
| **Date of Use**            | Tanggal rencana penggunaan barang.                  |
| **Purpose / Keperluan**    | Deskripsi singkat alasan pengajuan.                 |
| **Request Number**         | Nomor otomatis (format: \`PR-YYYYMMDD-XXXX\`).        |
| **Date Request**           | Tanggal pengajuan dibuat.                           |
| **Needed Date**            | Tanggal target barang dibutuhkan.                   |
| **Shipping Address**       | Alamat tujuan pengiriman.                           |
| **Early Payment Terms**    | Ketentuan pembayaran awal (opsional).               |
| **Messages / Notes**       | Catatan tambahan (opsional).                        |

### Items Table

| No.       | Month/Year for Use | Item Name     | Merk / Type | Specification | Quantity | Unit | Price / Unit (Rp) | Total (Rp)  | Item Photo | Purchase Link | User / PIC | Location (Room)    | Notes     |
| --------- | ------------------ | ------------- | ----------- | ------------- | -------- | ---- | ----------------- | ----------- | ---------- | ------------- | ---------- | ------------------ | --------- |
| 1         | October 2025       | Tempat Tissue | Informa     | White         | 1        | unit | 129,000           | 129,000     | –          | [link]        | Nike Eka F | R. Meeting Finance | Non-Asset |
| 2         | October 2025       | Laptop Stand  | Maxi BGS    | Silver        | 1        | unit | 145,000           | 145,000     | –          | [link]        | Nike Eka F | R. Head of Finance | Non-Asset |
| 3         | October 2025       | Laptop Holder | SUIRGE      | Black         | 1        | pcs  | 61,000            | 61,000      | –          | [link]        | Aldienda   | R. Finance         | Non-Asset |
| **TOTAL** |                    |               |             |               |          |      |                   | **335,000** |            |               |            |                    |           |

### Approval & Reviewer Fields

| Field              | Description                                                     |
| ------------------ | --------------------------------------------------------------- |
| **Reviewer**       | User yang memverifikasi kebutuhan barang.                       |
| **Approver**       | User yang menyetujui atau menolak pengajuan.                    |
| **Status**         | Status proses (Draft, Submitted, Reviewed, Approved, Rejected). |
| **Reviewer Notes** | Catatan koreksi dari reviewer (opsional).                       |

### Workflow

\`\`\`
DRAFT → SUBMITTED → REVIEWED → APPROVED
                     ↳ REJECTED
\`\`\`

---

## 3. Purchase Order — Structure & Fields

Purchase Order dibuat **berdasarkan Purchase Request yang telah disetujui**.

### Header Information

| Field                  | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **Source Request**     | Nomor PR asal yang disetujui.                       |
| **Vendor**             | Vendor dipilih setelah PR disetujui.                |
| **Payment Method**     | Metode pembayaran (contoh: PAYLATER, TRANSFER 14D). |
| **Location Inventory** | Lokasi gudang/inventori tujuan.                     |
| **Order Number**       | Nomor otomatis (format: \`PO-YYYYMMDD-XXXX\`).        |
| **Date Order**         | Tanggal pembuatan order.                            |
| **Shipping Date**      | Tanggal pengiriman barang.                          |
| **Shipping Address**   | Alamat tujuan pengiriman barang.                    |

---

## 4. Purchase Invoice — Structure & Fields

Purchase Invoice dibuat dari **Purchase Order yang telah diproses**.

### Header Information

| Field                  | Description                                  |
| ---------------------- | -------------------------------------------- |
| **Invoice Number**     | Nomor otomatis (format: \`PI-YYYYMMDD-XXXX\`). |
| **Source Order**       | Nomor PO asal.                               |
| **Payment Method**     | Diambil dari PO.                             |
| **Location Inventory** | Lokasi tujuan pengiriman.                    |
| **Vendor**             | Vendor dari PO.                              |
| **Invoice Date**       | Tanggal pembuatan invoice.                   |
| **Shipping Date**      | Tanggal pengiriman barang.                   |
| **Shipping Address**   | Alamat tujuan pengiriman.                    |

---

## 7. Inventory — Inventory & Services (Updated Concept)

### 7.1 Item Header

*   **Number** — kode unik item.
*   **Item Name** — nama tampilan.
*   **Type** — \`Inventory\` atau \`Service\` (radio).
`;