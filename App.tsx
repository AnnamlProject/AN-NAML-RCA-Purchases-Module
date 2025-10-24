
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import PurchaseRequestPage from './pages/PurchaseRequestPage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import PurchaseInvoicePage from './pages/PurchaseInvoicePage';
import InventoryPage from './pages/InventoryPage';
import VendorsPage from './pages/VendorsPage';
import { PurchaseRequest, PurchaseOrder } from './data/mockData';
import ProjectPlannerPage from './pages/ProjectPlannerPage';

// FIX: Define and export Page type to be used by Sidebar component, resolving the import error.
// This type includes all pages navigable from the sidebar.
export type Page = 'dashboard' | 'pr' | 'po' | 'pi' | 'inventory' | 'vendors' | 'settings' | 'planner';

const App: React.FC = () => {
  // Default to Purchase Requests page, but could be 'dashboard' or other.
  const [currentPage, setCurrentPage] = useState<Page>('pr');
  
  // State to pass data between pages for creation flows
  const [prForPo, setPrForPo] = useState<PurchaseRequest | null>(null);
  const [poForPi, setPoForPi] = useState<PurchaseOrder | null>(null);

  const handleCreatePo = useCallback((pr: PurchaseRequest) => {
    setPrForPo(pr);
    setCurrentPage('po');
  }, []);

  const handleCreatePi = useCallback((po: PurchaseOrder) => {
    setPoForPi(po);
    setCurrentPage('pi');
  }, []);
  
  const resetPrForPo = useCallback(() => setPrForPo(null), []);
  const resetPoForPi = useCallback(() => setPoForPi(null), []);

  const renderPage = () => {
    switch (currentPage) {
      case 'pr':
        return <PurchaseRequestPage onCreatePo={handleCreatePo} />;
      case 'po':
        return <PurchaseOrderPage initialPrData={prForPo} onCreationComplete={resetPrForPo} onCreatePi={handleCreatePi} />;
      case 'pi':
        return <PurchaseInvoicePage initialPoData={poForPi} onCreationComplete={resetPoForPi} />;
      case 'inventory':
        return <InventoryPage />;
      case 'vendors':
        return <VendorsPage />;
      // The AI Project Planner is a distinct module. For now, we can have a placeholder or render it.
      // Let's render a placeholder for dashboard and settings.
      case 'dashboard':
      case 'settings':
      default:
        return (
          <div className="p-8 text-center text-gray-400 h-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white capitalize">{currentPage}</h1>
            <p className="mt-2">This page is under construction.</p>
            {/* The ProjectPlannerPage could be rendered here or on its own route, but for simplicity let's put it on the dashboard */}
            {currentPage === 'dashboard' && (
              <div className="mt-8 p-6 bg-gray-800 rounded-lg w-full max-w-4xl text-left">
                <h2 className="text-lg font-semibold text-cyan-400">AI Project Planner Demo</h2>
                <p className="text-sm text-gray-400 mb-4">You can find the AI project planner functionality below.</p>
                <div className="h-[60vh] relative">
                  <ProjectPlannerPage/>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900/95 text-gray-200 font-sans antialiased">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-hidden">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
