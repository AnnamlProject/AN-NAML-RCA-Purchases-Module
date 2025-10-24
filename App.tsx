import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PurchaseRequestPage from './pages/PurchaseRequestPage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import PurchaseInvoicePage from './pages/PurchaseInvoicePage';
import { PurchaseOrder } from './data/mockData';
import PRListPage from "./pages/PRListPage";
import { PurchaseRequest } from "./types/purchases";

// For future expansion
import InventoryPage from './pages/InventoryPage';
import VendorsPage from './pages/VendorsPage';
// import DashboardPage from './pages/DashboardPage';

export type Page = 'dashboard' | 'pr-list' | 'pr-form' | 'po' | 'pi' | 'inventory' | 'vendors' | 'settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('pr-list');
  const [newPoFromPr, setNewPoFromPr] = useState<any | null>(null);
  const [newPiFromPo, setNewPiFromPo] = useState<PurchaseOrder | null>(null);
  const [editingPrId, setEditingPrId] = useState<string | null>(null);

  const handleCreatePoFromPr = (pr: any) => {
    setNewPoFromPr(pr);
    setCurrentPage('po');
  };
  
  const handleCreatePiFromPo = (po: PurchaseOrder) => {
    setNewPiFromPo(po);
    setCurrentPage('pi');
  };

  // --- New Handlers for PR List ---
  function onNewPR() {
    setEditingPrId(null);
    setCurrentPage("pr-form");
  }

  function onOpenPR(id: string) {
    setEditingPrId(id);
    // For now, this just opens a new form. A full implementation would load the PR by id.
    setCurrentPage("pr-form");
  }

  function onCreatePO(pr: PurchaseRequest) {
    // Map from new storage format to old mock format for compatibility
    const prForPoPage = {
      ...pr,
      id: pr.id,
      requestNumber: pr.number,
      division: pr.schoolDivision,
      totalAmount: pr.total,
      items: pr.items.map(it => ({
        id: it.id,
        monthYearForUse: it.monthYear || '',
        itemName: it.name || '',
        merkType: it.brand || '',
        specification: it.spec || '',
        quantity: it.qty || 0,
        unit: it.unit || 'unit',
        pricePerUnit: it.price || 0,
        total: (it.qty || 0) * (it.price || 0),
        purchaseLink: it.link || '#',
        userPIC: it.userPic || '',
        location: it.location || '',
        notes: it.notes || '',
      })),
    };
    handleCreatePoFromPr(prForPoPage);
  }
  // --- End New Handlers ---

  const renderPage = () => {
    switch (currentPage) {
      case 'pr-list':
        return <PRListPage onNewPR={onNewPR} onOpenPR={onOpenPR} onCreatePO={onCreatePO} />;
      case 'pr-form':
        // The existing page is used for the form.
        // It's not aware of the list page, but it now saves to localStorage.
        return <PurchaseRequestPage onCreatePo={handleCreatePoFromPr} />;
      case 'po':
        return <PurchaseOrderPage 
                  initialPrData={newPoFromPr} 
                  onCreationComplete={() => setNewPoFromPr(null)}
                  onCreatePi={handleCreatePiFromPo}
                />;
      case 'pi':
        return <PurchaseInvoicePage 
                  initialPoData={newPiFromPo}
                  onCreationComplete={() => setNewPiFromPo(null)}
                />;
      case 'inventory':
        return <InventoryPage />;
      case 'vendors':
        return <VendorsPage />;
      default:
        return (
          <div className="p-8 text-gray-400">
            <h1 className="text-3xl font-bold text-white mb-4">Module Not Implemented</h1>
            <p>The "{currentPage.toUpperCase()}" module is not yet available in this mock-up.</p>
             <p className="mt-4">Please select "Purchase Requests", "Purchase Orders", or "Purchase Invoices" from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300 font-sans antialiased">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800/50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
