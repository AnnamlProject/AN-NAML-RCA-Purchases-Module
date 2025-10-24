
import React, { useState } from 'react';
import PRListPage from "./src/pages/PRListPage";
import PurchaseRequest from "./src/pages/PurchaseRequest";
import { PurchaseRequest as PurchaseRequestType } from "./src/types/purchases";

type Route = 
  | { name: 'pr-list' }
  | { name: 'pr-form'; prId?: string };

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'pr-list' });
  const [prForPo, setPrForPo] = useState<PurchaseRequestType | null>(null);

  const handleCreatePO = (pr: PurchaseRequestType) => {
    setPrForPo(pr);
    // For now, we just log this action. A full router would navigate to the PO page.
    console.log("Request to create PO for:", pr.number);
    alert(`Create PO from ${pr.number}. See console for details.`);
  };
  
  const handleNewPR = () => {
    setRoute({ name: 'pr-form' });
  };

  const handleOpenPR = (id: string) => {
    setRoute({ name: 'pr-form', prId: id });
  };
  
  const handleBackToList = () => {
    setRoute({ name: 'pr-list' });
  };

  const renderPage = () => {
    switch (route.name) {
      case 'pr-list':
        return <PRListPage onNewPR={handleNewPR} onOpenPR={handleOpenPR} onCreatePO={handleCreatePO} />;
      case 'pr-form':
        return <PurchaseRequest prId={route.prId} onBack={handleBackToList} />;
      default:
        return <PRListPage onNewPR={handleNewPR} onOpenPR={handleOpenPR} onCreatePO={handleCreatePO} />;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
};

export default App;
