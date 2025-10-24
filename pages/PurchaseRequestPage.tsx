import React, { useState, useMemo, useEffect } from 'react';
import { mockPurchaseRequests } from '../data/mockData';
import StatusPill from '../components/StatusPill';
import { PlusCircleIcon, Trash2Icon, LinkIcon, ImageIcon } from '../components/icons';
import { saveOrUpdatePR } from '../lib/prStorage';
// FIX: Import `PRStatus` to resolve 'Cannot find name' error.
import { PurchaseRequest, PRItem, PRStatus } from '../types/purchases';


// Helper to map from old data structure to new localStorage structure
function mapToStorageFormat(req: any, newStatus?: PRStatus): PurchaseRequest {
    const subtotal = req.items.reduce((acc: number, item: any) => acc + (item.total || 0), 0);
    // Note: This is a simplified tax calculation. A more robust solution would be needed for production.
    const tax = req.items.reduce((acc: number, item: any) => acc + (item.taxCode === 'PPN11' ? (item.total || 0) * 0.11 : 0), 0);
    const total = subtotal + tax;

    return {
        id: req.id,
        number: req.requestNumber,
        schoolDivision: req.division,
        pic: req.pic,
        dateOfUse: req.dateOfUse,
        purpose: req.purpose,
        dateRequest: req.dateRequest,
        neededDate: req.neededDate,
        shippingAddress: req.shippingAddress,
        items: req.items.map((it: any): PRItem => ({
            id: it.id,
            monthYear: it.monthYearForUse,
            name: it.itemName,
            brand: it.merkType,
            spec: it.specification,
            qty: it.quantity,
            unit: it.unit,
            price: it.pricePerUnit,
            link: it.purchaseLink,
            userPic: it.userPIC,
            location: it.location,
            notes: it.notes,
            taxCode: "PPN11", // default
        })),
        subtotal,
        tax,
        total: req.totalAmount,
        status: newStatus || req.status.toUpperCase(),
        reviewer: req.reviewer,
        approver: req.approver,
        reviewerNotes: req.reviewerNotes,
        createdAt: req.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}


const PurchaseRequestForm: React.FC<{
  request: any; // Using 'any' to bridge old and new types
  onClose: () => void;
  onUpdate: (request: any) => void;
  onCreatePo: (request: any) => void;
}> = ({ request, onClose, onUpdate, onCreatePo }) => {
  const [reviewerNotesInput, setReviewerNotesInput] = useState('');
  
  useEffect(() => {
    if (request) {
      setReviewerNotesInput(request.reviewerNotes || '');
    }
  }, [request]);


  if (!request) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-800/50 p-8 text-gray-500">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Select a Request</h2>
                <p>Select a purchase request from the list to view its details, or create a new one.</p>
            </div>
        </div>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      if (request) {
          onUpdate({ ...request, [name]: value });
      }
  };

  const handleSubmitForApproval = () => {
    if (request) {
      const updatedRequest = { ...request, status: 'Submitted' };
      onUpdate(updatedRequest);
      saveOrUpdatePR(mapToStorageFormat(updatedRequest, 'SUBMITTED'));
    }
  };

  const handleReview = () => {
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'Reviewed',
        reviewer: 'John Doe',
        reviewerNotes: reviewerNotesInput,
      };
      onUpdate(updatedRequest);
      saveOrUpdatePR(mapToStorageFormat(updatedRequest, 'REVIEWED'));
    }
  };

  const handleApprove = () => {
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'Approved',
        approver: 'Jane Smith',
        reviewerNotes: reviewerNotesInput,
      };
      onUpdate(updatedRequest);
      saveOrUpdatePR(mapToStorageFormat(updatedRequest, 'APPROVED'));
    }
  };

  const handleReject = () => {
    if (request) {
      const updatedRequest = {
        ...request,
        status: 'Rejected',
        reviewer: 'John Doe',
        reviewerNotes: reviewerNotesInput,
      };
      onUpdate(updatedRequest);
      saveOrUpdatePR(mapToStorageFormat(updatedRequest, 'REJECTED'));
    }
  };

  const handleSaveDraft = () => {
    if (request) {
      onUpdate(request);
      saveOrUpdatePR(mapToStorageFormat(request, 'DRAFT'));
    }
  };
  
  const isDraft = request.status === 'Draft';

  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        <div className="p-6 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">{request.requestNumber || 'New Purchase Request'}</h2>
                    <p className="text-sm text-gray-400">Purpose: {request.purpose}</p>
                </div>
                <StatusPill status={request.status} />
            </div>
        </div>

        <div className="p-6 space-y-6 flex-grow">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">School / Division:</label>
                    {isDraft ? <input type="text" name="division" value={request.division} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{request.division}</span>}
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Person in Charge (PIC):</label>
                    {isDraft ? <input type="text" name="pic" value={request.pic} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{request.pic}</span>}
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Date of Use:</label>
                    {isDraft ? <input type="date" name="dateOfUse" value={request.dateOfUse} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" style={{colorScheme: 'dark'}}/> : <span className="text-white pt-2 block">{request.dateOfUse}</span>}
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Request Number:</label>
                    <span className="text-white pt-2 block">{request.requestNumber}</span>
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Date Request:</label>
                    <span className="text-white pt-2 block">{request.dateRequest}</span>
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Needed Date:</label>
                    {isDraft ? <input type="date" name="neededDate" value={request.neededDate} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" style={{colorScheme: 'dark'}}/> : <span className="text-white pt-2 block">{request.neededDate}</span>}
                </div>
                <div className="col-span-full">
                     <label className="font-semibold text-gray-400 block mb-1">Purpose / Keperluan:</label>
                    {isDraft ? <input type="text" name="purpose" value={request.purpose} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{request.purpose}</span>}
                </div>
                <div className="col-span-full">
                    <label className="font-semibold text-gray-400 block mb-1">Shipping Address:</label>
                    {isDraft ? <textarea name="shippingAddress" value={request.shippingAddress} onChange={handleChange} rows={2} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{request.shippingAddress}</span>}
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Early Payment Terms:</label>
                    {isDraft ? <input type="text" name="earlyPaymentTerms" value={request.earlyPaymentTerms || ''} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{request.earlyPaymentTerms || 'N/A'}</span>}
                </div>
                <div className="col-span-2">
                    <label className="font-semibold text-gray-400 block mb-1">Messages / Notes:</label>
                    {isDraft ? <textarea name="messages" value={request.messages || ''} onChange={handleChange} rows={2} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{request.messages || 'N/A'}</span>}
                </div>
            </div>

            {/* Items Table */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Items Requested</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                    <table className="min-w-full divide-y divide-gray-700/50 text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 w-8">No.</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Month/Year for Use</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 min-w-40">Item Name</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Merk / Type</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Specification</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Qty</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Unit</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Price / Unit</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Total</th>
                                <th scope="col" className="px-3 py-3 text-center font-medium text-gray-300">Photo</th>
                                <th scope="col" className="px-3 py-3 text-center font-medium text-gray-300">Link</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">User / PIC</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Location</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 min-w-32">Notes</th>
                                { isDraft && <th scope="col" className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Delete</span></th> }
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-gray-900">
                            {request.items.map((item: any, index: number) => (
                                <tr key={item.id}>
                                    <td className="px-3 py-3 text-gray-400">{index + 1}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.monthYearForUse}</td>
                                    <td className="px-3 py-3 text-white font-medium">{item.itemName}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.merkType}</td>
                                    <td className="px-3 py-3 text-gray-400">{item.specification}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{item.quantity}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.unit}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{formatCurrency(item.pricePerUnit)}</td>
                                    <td className="px-3 py-3 text-right text-white font-medium">{formatCurrency(item.total)}</td>
                                    <td className="px-3 py-3 text-center text-gray-400"><ImageIcon className="w-4 h-4 mx-auto"/></td>
                                    <td className="px-3 py-3 text-center"><a href={item.purchaseLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300"><LinkIcon className="w-4 h-4 mx-auto"/></a></td>
                                    <td className="px-3 py-3 text-gray-300">{item.userPIC}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.location}</td>
                                    <td className="px-3 py-3 text-gray-400">{item.notes}</td>
                                    { isDraft && <td><button className="p-1 text-gray-500 hover:text-red-400"><Trash2Icon className="w-4 h-4" /></button></td> }
                                </tr>
                            ))}
                              { isDraft && 
                                <tr>
                                    <td colSpan={15} className="px-4 py-3">
                                        <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-sm">
                                            <PlusCircleIcon className="w-4 h-4" />
                                            <span>Add Item</span>
                                        </button>
                                    </td>
                                </tr>
                            }
                        </tbody>
                        <tfoot className="bg-gray-800/50">
                            <tr>
                                <td colSpan={8} className="px-4 py-3 text-right font-semibold text-gray-300">Grand Total</td>
                                <td className="px-4 py-3 text-right font-bold text-white">{formatCurrency(request.totalAmount)}</td>
                                <td colSpan={isDraft ? 6 : 5}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            
             {/* Approval & Reviewer Fields */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm mt-6">
                <div>
                    <label className="font-semibold text-gray-400 block">Reviewer:</label>
                    <span className="text-white mt-1 block">{request.reviewer || 'N/A'}</span>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block">Approver:</label>
                    <span className="text-white mt-1 block">{request.approver || 'N/A'}</span>
                </div>
                <div className="col-span-full">
                    <label htmlFor="reviewerNotes" className="font-semibold text-gray-400 block">Reviewer Notes:</label>
                    {request.status === 'Submitted' || request.status === 'Reviewed' ? (
                        <textarea
                            id="reviewerNotes"
                            name="reviewerNotes"
                            value={reviewerNotesInput}
                            onChange={(e) => setReviewerNotesInput(e.target.value)}
                            rows={3}
                            className="mt-1 w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                            placeholder="Enter review or rejection notes here..."
                        />
                    ) : (
                        <div className="mt-1 p-2 bg-gray-800/50 border border-gray-700/50 rounded-md min-h-[4.5rem] text-gray-300">
                            {request.reviewerNotes || 'No notes from reviewer.'}
                        </div>
                    )}
                </div>
             </div>
        </div>

        <div className="p-6 bg-gray-900 border-t border-gray-700/50 mt-auto sticky bottom-0">
            <div className="flex items-center justify-end space-x-4">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Close</button>
                
                { request.status === 'Draft' && <>
                  <button onClick={handleSaveDraft} className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500">Save Draft</button>
                  <button onClick={handleSubmitForApproval} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700">Submit for Approval</button>
                </> }

                { request.status === 'Rejected' && <button onClick={handleSubmitForApproval} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700">Re-submit for Approval</button> }
                
                { request.status === 'Submitted' && <>
                  <button onClick={handleReject} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
                  <button onClick={handleReview} className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700">Review</button>
                </> }

                { request.status === 'Reviewed' && <>
                  <button onClick={handleReject} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Reject</button>
                  <button onClick={handleApprove} className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Approve</button>
                </> }

                { request.status === 'Approved' && <button onClick={() => onCreatePo(request)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Create Purchase Order</button> }
            </div>
        </div>
    </div>
  );
};


const PurchaseRequestPage: React.FC<{ onCreatePo: (pr: any) => void; }> = ({ onCreatePo }) => {
    // Add stable identity state for new drafts
    const [prId] = React.useState(crypto.randomUUID());
    const [createdAt] = React.useState(new Date().toISOString());

    const [requests, setRequests] = useState<any[]>(mockPurchaseRequests);
    const [selectedRequest, setSelectedRequest] = useState<any | null>(requests.find(r => r.status === 'Submitted') || requests[0]);

    const handleSelectRequest = (request: any) => {
        setSelectedRequest(request);
    };

    const handleCreateNewRequest = () => {
        const date = new Date();
        const requestNumber = `PR-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        const newRequest = {
            id: prId,
            createdAt: createdAt,
            requestNumber,
            division: '',
            pic: 'Nike Eka F', // Default to current user
            dateOfUse: '',
            purpose: '',
            dateRequest: date.toISOString().split('T')[0],
            neededDate: '',
            shippingAddress: 'RCA Head Office, Jakarta',
            status: 'Draft',
            items: [],
            totalAmount: 0,
            earlyPaymentTerms: '',
            messages: '',
            reviewerNotes: ''
        };

        setRequests(prev => [newRequest, ...prev]);
        setSelectedRequest(newRequest);
        // Persist the new draft immediately
        saveOrUpdatePR(mapToStorageFormat(newRequest, 'DRAFT'));
    };

    const handleUpdateRequest = (updatedRequest: any) => {
        const newRequests = requests.map(r => (r.id === updatedRequest.id ? updatedRequest : r));
        setRequests(newRequests);
        setSelectedRequest(updatedRequest);
        // Note: Specific status updates are handled in the form's action handlers
        // This handler now primarily updates the in-memory state for the UI
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    
    const sortedRequests = useMemo(() => {
        return [...requests].sort((a, b) => new Date(b.dateRequest).getTime() - new Date(a.dateRequest).getTime());
    }, [requests]);

    return (
        <div className="flex h-full">
            {/* Left Column: List of Requests */}
            <div className="w-1/3 max-w-sm flex-shrink-0 bg-gray-900/70 border-r border-gray-700/50 flex flex-col">
                <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white">Purchase Requests</h2>
                        <button onClick={handleCreateNewRequest} className="p-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700">
                           <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <ul className="divide-y divide-gray-800">
                        {sortedRequests.map(req => (
                            <li key={req.id}>
                                <button
                                    onClick={() => handleSelectRequest(req)}
                                    className={`w-full text-left p-4 transition-colors duration-150 ${
                                        selectedRequest?.id === req.id ? 'bg-cyan-500/10' : 'hover:bg-gray-800/60'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm text-white">{req.requestNumber}</p>
                                            <p className="text-xs text-gray-400 truncate pr-2">{req.purpose}</p>
                                        </div>
                                       <StatusPill status={req.status} />
                                    </div>
                                    <div className="flex justify-between items-baseline mt-2">
                                        <p className="text-xs text-gray-500">{req.pic} • {req.dateRequest}</p>
                                        <p className="text-sm font-bold text-cyan-400">{formatCurrency(req.totalAmount)}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Column: Request Form/Details */}
            <div className="flex-1 flex flex-col min-w-0">
                <PurchaseRequestForm 
                    request={selectedRequest} 
                    onClose={() => setSelectedRequest(null)}
                    onUpdate={handleUpdateRequest}
                    onCreatePo={onCreatePo}
                />
            </div>
        </div>
    );
};

export default PurchaseRequestPage;
