import React, { useState, useMemo, useEffect } from 'react';
import { mockPurchaseOrders, PurchaseOrder, PurchaseRequest, PurchaseOrderItem, mockVendors } from '../data/mockData';
import StatusPill from '../components/StatusPill';
import { PlusCircleIcon, Trash2Icon } from '../components/icons';

const PurchaseOrderForm: React.FC<{
  order: PurchaseOrder | null;
  onClose: () => void;
  onUpdate: (order: PurchaseOrder) => void;
  onCreatePi: (order: PurchaseOrder) => void;
}> = ({ order, onClose, onUpdate, onCreatePi }) => {
  if (!order) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-800/50 p-8 text-gray-500">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Select an Order</h2>
                <p>Select a purchase order from the list to view its details, or create a new one.</p>
            </div>
        </div>
    );
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  const isDraft = order.status === 'Draft';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      if (order) {
          onUpdate({ ...order, [name]: value });
      }
  };

  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const vendorId = e.target.value;
      const selectedVendor = mockVendors.find(v => v.id === vendorId);
      if (selectedVendor && order) {
          onUpdate({
              ...order,
              vendor: selectedVendor.name,
              paymentMethod: selectedVendor.paymentTerms,
          });
      } else if (order) {
          onUpdate({
              ...order,
              vendor: '',
              paymentMethod: '',
          });
      }
  };

  const handleProcess = () => {
    onUpdate({ ...order, status: 'Processed' });
  };

  const handleCancelOrder = () => {
    onUpdate({ ...order, status: 'Cancelled' });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        <div className="p-6 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">{order.orderNumber || 'New Purchase Order'}</h2>
                    <p className="text-sm text-gray-400">Source Request: <span className="text-cyan-400 cursor-pointer hover:underline">{order.sourceRequest}</span></p>
                </div>
                <StatusPill status={order.status} />
            </div>
        </div>

        <div className="p-6 space-y-6 flex-grow">
            {/* Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Order Number:</label>
                    <span className="text-white pt-2 block">{order.orderNumber}</span>
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Date Order:</label>
                    <span className="text-white pt-2 block">{order.dateOrder}</span>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Shipping Date:</label>
                    {isDraft ? <input type="date" name="shippingDate" value={order.shippingDate} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500" style={{colorScheme: 'dark'}}/> : <span className="text-white pt-2 block">{order.shippingDate}</span>}
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Vendor:</label>
                    {isDraft ? (
                        <select
                            id="vendor-select"
                            value={mockVendors.find(v => v.name === order.vendor)?.id || ''}
                            onChange={handleVendorChange}
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"
                        >
                            <option value="">-- Select Vendor --</option>
                            {mockVendors.filter(v => v.status === 'Active').map(v => ( <option key={v.id} value={v.id}>{v.name}</option> ))}
                        </select>
                    ) : <span className="text-white pt-2 block">{order.vendor}</span>}
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Payment Method:</label>
                    {isDraft ? <input type="text" name="paymentMethod" value={order.paymentMethod} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{order.paymentMethod}</span>}
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Location Inventory:</label>
                     {isDraft ? <input type="text" name="locationInventory" value={order.locationInventory} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{order.locationInventory}</span>}
                </div>
                <div className="col-span-full">
                    <label className="font-semibold text-gray-400 block mb-1">Shipping Address:</label>
                    {isDraft ? <textarea name="shippingAddress" value={order.shippingAddress} onChange={handleChange} rows={2} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{order.shippingAddress}</span>}
                </div>
            </div>

            {/* Items Table */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Items</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                    <table className="min-w-full divide-y divide-gray-700/50 text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 min-w-40">Item</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 min-w-40">Description</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Order Qty</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Unit</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Price</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Discount (%)</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Tax</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Tax Amt</th>
                                <th scope="col" className="px-3 py-3 text-right font-medium text-gray-300">Amount</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300">Account</th>
                                <th scope="col" className="px-3 py-3 text-left font-medium text-gray-300 min-w-32">Notes</th>
                                { isDraft && <th scope="col" className="relative py-3.5 pl-3 pr-4"><span className="sr-only">Delete</span></th> }
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 bg-gray-900">
                            {order.items.map(item => (
                                <tr key={item.id}>
                                    <td className="px-3 py-3 text-white font-medium">{item.itemName}</td>
                                    <td className="px-3 py-3 text-gray-400">{item.description}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{item.orderQty}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.unit}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{formatCurrency(item.price)}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{item.discount}%</td>
                                    <td className="px-3 py-3 text-gray-300">{item.tax}</td>
                                    <td className="px-3 py-3 text-right text-gray-300">{formatCurrency(item.taxAmt)}</td>
                                    <td className="px-3 py-3 text-right text-white font-medium">{formatCurrency(item.amount)}</td>
                                    <td className="px-3 py-3 text-gray-300">{item.account}</td>
                                    <td className="px-3 py-3 text-gray-400">{item.notes}</td>
                                    { isDraft && <td><button className="p-1 text-gray-500 hover:text-red-400"><Trash2Icon className="w-4 h-4" /></button></td> }
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Additional Fields & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <label className="font-semibold text-gray-400 block mb-1">Early Payment Terms:</label>
                        {isDraft ? <input type="text" name="earlyPaymentTerms" value={order.earlyPaymentTerms || ''} onChange={handleChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{order.earlyPaymentTerms || 'N/A'}</span>}
                    </div>
                    <div>
                         <label className="font-semibold text-gray-400 block mb-1">Messages:</label>
                         {isDraft ? <textarea name="messages" value={order.messages || ''} onChange={handleChange} rows={3} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/> : <span className="text-white pt-2 block">{order.messages || 'N/A'}</span>}
                    </div>
                </div>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal:</span>
                        <span className="text-white font-medium">{formatCurrency(order.subtotal)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Total Tax:</span>
                        <span className="text-white font-medium">{formatCurrency(order.totalTax)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="text-gray-400">Freight:</span>
                        {isDraft ? <input type="number" name="freight" value={order.freight} onChange={handleChange} className="w-24 bg-gray-800/50 border border-gray-700 rounded-md py-1 px-2 text-white text-right"/> : <span className="text-white font-medium">{formatCurrency(order.freight)}</span>}
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-2 mt-2">
                        <span className="text-base font-bold text-white">Grand Total:</span>
                        <span className="text-base font-bold text-cyan-400">{formatCurrency(order.grandTotal)}</span>
                    </div>
                </div>
             </div>
        </div>

        <div className="p-6 bg-gray-900 border-t border-gray-700/50 mt-auto sticky bottom-0">
            <div className="flex items-center justify-end space-x-4">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Close</button>
                
                { (order.status === 'Draft' || order.status === 'Processed') && 
                  <button onClick={handleCancelOrder} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700">Cancel Order</button> 
                }

                { order.status === 'Draft' && 
                  <button onClick={handleProcess} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700">Process</button> 
                }
                
                { order.status === 'Processed' && 
                  <button onClick={() => onCreatePi(order)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Create Invoice</button> 
                }
            </div>
        </div>
    </div>
  );
};

interface PurchaseOrderPageProps {
    initialPrData: PurchaseRequest | null;
    onCreationComplete: () => void;
    onCreatePi: (po: PurchaseOrder) => void;
}

const PurchaseOrderPage: React.FC<PurchaseOrderPageProps> = ({ initialPrData, onCreationComplete, onCreatePi }) => {
    const [orders, setOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(orders[0]);

    useEffect(() => {
        if (initialPrData) {
            const newPoId = `po_${new Date().getTime()}`;
            const date = new Date();
            const poNumber = `PO-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

            const newItems: PurchaseOrderItem[] = initialPrData.items.map(prItem => {
                const taxAmt = prItem.pricePerUnit * prItem.quantity * 0.11;
                const amount = (prItem.pricePerUnit * prItem.quantity) + taxAmt;
                return {
                    id: prItem.id,
                    itemName: prItem.itemName,
                    orderQty: prItem.quantity,
                    unit: prItem.unit,
                    description: prItem.specification,
                    price: prItem.pricePerUnit,
                    discount: 0,
                    tax: 'PPN 11%',
                    taxAmt: taxAmt,
                    amount: amount,
                    account: 'Office Supplies', // Default account
                    notes: prItem.notes,
                };
            });

            const subtotal = newItems.reduce((acc, item) => acc + (item.price * item.orderQty), 0);
            const totalTax = newItems.reduce((acc, item) => acc + item.taxAmt, 0);
            const freight = 0; // Default freight
            const grandTotal = subtotal + totalTax + freight;
            
            const newOrder: PurchaseOrder = {
              id: newPoId,
              orderNumber: poNumber,
              sourceRequest: initialPrData.requestNumber,
              vendor: '', // User needs to select this
              paymentMethod: '', // User needs to select this
              locationInventory: 'Main Office Storage', // Default
              dateOrder: date.toISOString().split('T')[0],
              shippingDate: initialPrData.neededDate,
              shippingAddress: initialPrData.shippingAddress,
              status: 'Draft',
              items: newItems,
              subtotal,
              totalTax,
              freight,
              grandTotal,
              earlyPaymentTerms: initialPrData.earlyPaymentTerms,
              messages: `Based on Purchase Request ${initialPrData.requestNumber}. Please confirm vendor and payment details.`,
            };

            setOrders(prevOrders => [newOrder, ...prevOrders]);
            setSelectedOrder(newOrder);
            onCreationComplete();
        }
    }, [initialPrData, onCreationComplete]);

    const handleSelectOrder = (order: PurchaseOrder) => {
        setSelectedOrder(order);
    };

    const handleUpdateOrder = (updatedOrder: PurchaseOrder) => {
        // Recalculate totals if freight changes
        const subtotal = updatedOrder.items.reduce((acc, item) => acc + (item.price * item.orderQty), 0);
        const totalTax = updatedOrder.items.reduce((acc, item) => acc + item.taxAmt, 0);
        const grandTotal = subtotal + totalTax + Number(updatedOrder.freight);

        const finalOrder = { ...updatedOrder, subtotal, totalTax, grandTotal };

        const newOrders = orders.map(o => (o.id === finalOrder.id ? finalOrder : o));
        setOrders(newOrders);
        setSelectedOrder(finalOrder);
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
    }
    
    const sortedOrders = useMemo(() => {
        return [...orders].sort((a, b) => new Date(b.dateOrder).getTime() - new Date(a.dateOrder).getTime());
    }, [orders]);

    return (
        <div className="flex h-full">
            {/* Left Column: List of Orders */}
            <div className="w-1/3 max-w-sm flex-shrink-0 bg-gray-900/70 border-r border-gray-700/50 flex flex-col">
                <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white">Purchase Orders</h2>
                        <button className="p-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 opacity-50 cursor-not-allowed" title="Create PO from PR">
                           <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <ul className="divide-y divide-gray-800">
                        {sortedOrders.map(ord => (
                            <li key={ord.id}>
                                <button
                                    onClick={() => handleSelectOrder(ord)}
                                    className={`w-full text-left p-4 transition-colors duration-150 ${
                                        selectedOrder?.id === ord.id ? 'bg-cyan-500/10' : 'hover:bg-gray-800/60'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm text-white">{ord.orderNumber}</p>
                                            <p className="text-xs text-gray-400">{ord.vendor || 'No Vendor Selected'}</p>
                                        </div>
                                       <StatusPill status={ord.status} />
                                    </div>
                                    <div className="flex justify-between items-baseline mt-2">
                                        <p className="text-xs text-gray-500">{ord.dateOrder}</p>
                                        <p className="text-sm font-bold text-cyan-400">{formatCurrency(ord.grandTotal)}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Right Column: Order Form/Details */}
            <div className="flex-1 flex flex-col min-w-0">
                <PurchaseOrderForm 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                    onUpdate={handleUpdateOrder}
                    onCreatePi={onCreatePi}
                />
            </div>
        </div>
    );
};

export default PurchaseOrderPage;