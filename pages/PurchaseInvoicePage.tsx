import React, { useState, useMemo, useEffect } from 'react';
import { mockPurchaseInvoices, PurchaseInvoice, PurchaseOrder, mockInventoryItems, PurchaseInvoiceItem } from '../data/mockData';
import StatusPill from '../components/StatusPill';
import { PlusCircleIcon } from '../components/icons';

const PurchaseInvoiceForm: React.FC<{
  invoice: PurchaseInvoice | null;
  onClose: () => void;
  onUpdate: (invoice: PurchaseInvoice) => void;
}> = ({ invoice, onClose, onUpdate }) => {
  if (!invoice) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-800/50 p-8 text-gray-500">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Select an Invoice</h2>
                <p>Select a purchase invoice from the list to view its details, or create a new one.</p>
            </div>
        </div>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  const isDraft = invoice.status === 'Draft';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      onUpdate({ ...invoice, [name]: value });
  };

  const handleProcess = () => {
    onUpdate({ ...invoice, status: 'Submitted' });
  };

  const handleMarkAsPaid = () => {
    onUpdate({ 
        ...invoice, 
        status: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0] 
    });
  };

  const handleCancelInvoice = () => {
      onUpdate({ ...invoice, status: 'Cancelled' });
  };


  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        <div className="p-6 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">{invoice.invoiceNumber || 'New Purchase Invoice'}</h2>
                    <p className="text-sm text-gray-400">Vendor: {invoice.vendor}</p>
                </div>
                <StatusPill status={invoice.status} />
            </div>
        </div>

        <div className="p-6 space-y-6 flex-grow">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Invoice Number:</label>
                    <span className="text-white pt-2 block">{invoice.invoiceNumber}</span>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Source Order:</label>
                    <span className="text-cyan-400 pt-2 block cursor-pointer hover:underline">{invoice.sourceOrder}</span>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Payment Method:</label>
                    <span className="text-white pt-2 block">{invoice.paymentMethod}</span>
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Location Inventory:</label>
                    <span className="text-white pt-2 block">{invoice.locationInventory}</span>
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Vendor:</label>
                    <span className="text-white pt-2 block">{invoice.vendor}</span>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Invoice Date:</label>
                    {isDraft ? <input type="date" name="invoiceDate" value={invoice.invoiceDate} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" style={{colorScheme: 'dark'}}/> : <span className="text-white pt-2 block">{invoice.invoiceDate}</span>}
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Shipping Date:</label>
                    {isDraft ? <input type="date" name="shippingDate" value={invoice.shippingDate} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" style={{colorScheme: 'dark'}}/> : <span className="text-white pt-2 block">{invoice.shippingDate}</span>}
                </div>
                <div className="col-span-2">
                    <label className="font-semibold text-gray-400 block mb-1">Shipping Address:</label>
                    <span className="text-white pt-2 block">{invoice.shippingAddress}</span>
                </div>
            </div>

            {/* Items Table */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Items</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                    <table className="min-w-full divide-y divide-gray-700/50 text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Item Number</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 min-w-40">Description</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Qty</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Order</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Back Order</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Unit</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Price</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Discount</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">VAT</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">VAT Value</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Amount</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Account</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 min-w-32">Specpose</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-gray-900">
                            {invoice.items.map(item => (
                                <tr key={item.id}>
                                    <td className="px-3 py-3 text-gray-300">{item.itemNumber}</td>
                                    <td className="px-3 py-3 text-white font-medium">{item.description}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{item.qty}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{item.order}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{item.backOrder}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.unit}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{formatCurrency(item.price)}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{item.discount}%</td>
                                    <td className="px-3 py-3 text-gray-300">{item.vat}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{formatCurrency(item.vatValue)}</td>
                                    <td className="px-3 py-3 text-right text-white font-medium">{formatCurrency(item.amount)}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.account}</td>
                                    <td className="px-3 py-3 text-gray-400">{item.specpose}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Summary Fields */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-2">
                    <label className="font-semibold text-gray-400 block text-sm">Notes:</label>
                    <p className="text-sm text-white mt-1">{invoice.notes || 'N/A'}</p>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-white font-medium">{formatCurrency(invoice.subtotal)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Tax:</span>
                        <span className="text-white font-medium">{formatCurrency(invoice.tax)}</span>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-gray-400">Freight:</span>
                        {isDraft ? <input type="number" name="freight" value={invoice.freight} onChange={handleChange} className="w-24 bg-gray-800/50 border border-gray-700 rounded-md py-1 px-2 text-white text-right"/> : <span className="text-white font-medium">{formatCurrency(invoice.freight)}</span>}
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                        <span className="text-base font-bold text-white">Total:</span>
                        <span className="text-base font-bold text-cyan-400">{formatCurrency(invoice.total)}</span>
                    </div>
                </div>
             </div>
        </div>

        <div className="p-6 bg-gray-900 border-t border-gray-700/50 mt-auto sticky bottom-0">
            <div className="flex items-center justify-end space-x-4">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Close</button>
                
                { (invoice.status === 'Draft' || invoice.status === 'Submitted') && 
                    <button onClick={handleCancelInvoice} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Cancel Invoice</button> 
                }
                
                { invoice.status === 'Draft' && 
                    <button onClick={handleProcess} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700">Process</button> 
                }

                { invoice.status === 'Submitted' && 
                    <button onClick={handleMarkAsPaid} className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700">Mark as Paid</button> 
                }
            </div>
        </div>
    </div>
  );
};

interface PurchaseInvoicePageProps {
    initialPoData: PurchaseOrder | null;
    onCreationComplete: () => void;
}

const PurchaseInvoicePage: React.FC<PurchaseInvoicePageProps> = ({ initialPoData, onCreationComplete }) => {
    const [invoices, setInvoices] = useState<PurchaseInvoice[]>(mockPurchaseInvoices);
    const [selectedInvoice, setSelectedInvoice] = useState<PurchaseInvoice | null>(invoices[0] || null);

    useEffect(() => {
        if (initialPoData) {
            const newPiId = `pi_${new Date().getTime()}`;
            const date = new Date();
            const piNumber = `PI-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

            const newItems: PurchaseInvoiceItem[] = initialPoData.items.map(poItem => {
                const inventoryItem = mockInventoryItems.find(inv => inv.itemName === poItem.itemName);
                return {
                    id: poItem.id,
                    itemNumber: inventoryItem?.itemNumber || 'N/A',
                    qty: poItem.orderQty,
                    order: poItem.orderQty,
                    backOrder: 0,
                    unit: poItem.unit,
                    description: `${poItem.itemName} - ${poItem.description}`,
                    price: poItem.price,
                    discount: poItem.discount,
                    vat: poItem.tax,
                    vatValue: poItem.taxAmt,
                    amount: poItem.amount,
                    account: poItem.account,
                    specpose: poItem.notes,
                };
            });

            const newInvoice: PurchaseInvoice = {
              id: newPiId,
              invoiceNumber: piNumber,
              sourceOrder: initialPoData.orderNumber,
              vendor: initialPoData.vendor,
              paymentMethod: initialPoData.paymentMethod,
              locationInventory: initialPoData.locationInventory,
              invoiceDate: date.toISOString().split('T')[0],
              shippingDate: initialPoData.shippingDate,
              shippingAddress: initialPoData.shippingAddress,
              status: 'Draft',
              items: newItems,
              subtotal: initialPoData.subtotal,
              tax: initialPoData.totalTax,
              freight: initialPoData.freight,
              total: initialPoData.grandTotal,
              notes: `Invoice for Purchase Order ${initialPoData.orderNumber}.`,
            };

            setInvoices(prevInvoices => [newInvoice, ...prevInvoices]);
            setSelectedInvoice(newInvoice);
            onCreationComplete();
        }
    }, [initialPoData, onCreationComplete]);

    const handleSelectInvoice = (invoice: PurchaseInvoice) => {
        setSelectedInvoice(invoice);
    };

    const handleUpdateInvoice = (updatedInvoice: PurchaseInvoice) => {
        // Recalculate total if freight changes
        const subtotal = updatedInvoice.items.reduce((acc, item) => acc + item.price * item.qty, 0);
        const tax = updatedInvoice.items.reduce((acc, item) => acc + item.vatValue, 0);
        const total = subtotal + tax + Number(updatedInvoice.freight);

        const finalInvoice = { ...updatedInvoice, subtotal, tax, total };

        const newInvoices = invoices.map(i => (i.id === finalInvoice.id ? finalInvoice : i));
        setInvoices(newInvoices);
        setSelectedInvoice(finalInvoice);
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    
    const sortedInvoices = useMemo(() => {
        return [...invoices].sort((a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime());
    }, [invoices]);

    return (
        <div className="flex h-full">
            {/* Left Column: List of Invoices */}
            <div className="w-1/3 max-w-sm flex-shrink-0 bg-gray-900/70 border-r border-gray-700/50 flex flex-col">
                <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white">Purchase Invoices</h2>
                         <button className="p-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 opacity-50 cursor-not-allowed" title="Create Invoice from PO">
                           <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <ul className="divide-y divide-gray-800">
                        {sortedInvoices.map(inv => (
                            <li key={inv.id}>
                                <button
                                    onClick={() => handleSelectInvoice(inv)}
                                    className={`w-full text-left p-4 transition-colors duration-150 ${
                                        selectedInvoice?.id === inv.id ? 'bg-cyan-500/10' : 'hover:bg-gray-800/60'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm text-white">{inv.invoiceNumber}</p>
                                            <p className="text-xs text-gray-400">{inv.vendor}</p>
                                        </div>
                                       <StatusPill status={inv.status} />
                                    </div>
                                    <div className="flex justify-between items-baseline mt-2">
                                        <p className="text-xs text-gray-500">{inv.invoiceDate}</p>
                                        <p className="text-sm font-bold text-cyan-400">{formatCurrency(inv.total)}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Column: Invoice Form/Details */}
            <div className="flex-1 flex flex-col min-w-0">
                <PurchaseInvoiceForm 
                    invoice={selectedInvoice} 
                    onClose={() => setSelectedInvoice(null)}
                    onUpdate={handleUpdateInvoice}
                />
            </div>
        </div>
    );
};

export default PurchaseInvoicePage;