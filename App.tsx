import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PurchaseRequestPage from './pages/PurchaseRequestPage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import PurchaseInvoicePage from './pages/PurchaseInvoicePage';
import { PurchaseRequest, PurchaseOrder } from './data/mockData';

// For future expansion
import InventoryPage from './pages/InventoryPage';
import VendorsPage from './pages/VendorsPage';
// import DashboardPage from './pages/DashboardPage';

export type Page = 'dashboard' | 'pr' | 'po' | 'pi' | 'inventory' | 'vendors' | 'settings';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('pr');
  const [newPoFromPr, setNewPoFromPr] = useState<PurchaseRequest | null>(null);
  const [newPiFromPo, setNewPiFromPo] = useState<PurchaseOrder | null>(null);

  const handleCreatePoFromPr = (pr: PurchaseRequest) => {
    setNewPoFromPr(pr);
    setCurrentPage('po');
  };
  
  const handleCreatePiFromPo = (po: PurchaseOrder) => {
    setNewPiFromPo(po);
    setCurrentPage('pi');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'pr':
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