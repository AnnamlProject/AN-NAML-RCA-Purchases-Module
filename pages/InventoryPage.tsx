import React, { useState, useMemo } from 'react';
import { mockInventoryItems, InventoryItem, mockVendors, mockChartOfAccounts } from '../data/mockData';
import { PlusCircleIcon, Trash2Icon } from '../components/icons';

type InventoryTab = 'Quantities' | 'Units' | 'Pricing' | 'Vendors' | 'Linked Account' | 'Build' | 'Taxes' | 'Description' | 'Picture';

const TABS: InventoryTab[] = ['Quantities', 'Units', 'Pricing', 'Vendors', 'Linked Account', 'Build', 'Taxes', 'Description', 'Picture'];

const TabButton: React.FC<{ label: InventoryTab; activeTab: InventoryTab; onClick: (tab: InventoryTab) => void }> = ({ label, activeTab, onClick }) => (
    <button
        onClick={() => onClick(label)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none ${
            activeTab === label
                ? 'bg-gray-800 text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
        }`}
    >
        {label}
    </button>
);

const InventoryForm: React.FC<{
  item: InventoryItem | null;
  onClose: () => void;
  onUpdate: (item: InventoryItem) => void;
}> = ({ item, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<InventoryTab>('Quantities');

  if (!item) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-800/50 p-8 text-gray-500">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Select an Item</h2>
                <p>Select an item or service from the list to view its details, or create a new one.</p>
            </div>
        </div>
    );
  }
  
  const isNew = !item.itemNumber;
  const isProcessable = item.itemNumber && item.itemName && item.type;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isRadio = e.target.type === 'radio';
    onUpdate({ ...item, [name]: isRadio ? value : e.target.value });
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Quantities':
        return (
            <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                <table className="min-w-full divide-y divide-gray-700/50 text-sm">
                    <thead className="bg-gray-800/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-300">Location</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-300">On Hand Quantity (RO)</th>
                            <th className="px-4 py-3 text-right font-medium text-gray-300">On Hand Value (RO)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 bg-gray-900">
                        {item.quantitiesPerLocation.map((q, index) => (
                            <tr key={index}>
                                <td className="px-4 py-3 text-white">{q.location}</td>
                                <td className="px-4 py-3 text-right text-gray-300">{q.onHandQuantity}</td>
                                <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(q.onHandValue)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
      case 'Units':
        return (
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold text-gray-400 block mb-1">Stocking Unit of Measure</label>
                        <input type="text" value={item.units.stockingUom} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white"/>
                    </div>
                </div>
                <div className="space-y-2 p-4 border border-gray-700 rounded-md">
                     <label className="flex items-center">
                        <input type="checkbox" checked={item.units.sellingUomSameAsStocking} className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-cyan-600 focus:ring-cyan-500"/>
                        <span className="ml-2 text-white">Selling unit same as stocking unit</span>
                    </label>
                    {!item.units.sellingUomSameAsStocking && (
                         <div className="grid grid-cols-2 gap-4 pt-2">
                             <input placeholder="Selling Unit (if different)" value={item.units.sellingUom} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white"/>
                             <input placeholder="Selling Relationship (e.g., 1 box = 12 pcs)" value={item.units.sellingRelationship} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white"/>
                         </div>
                    )}
                </div>
                 <div className="space-y-2 p-4 border border-gray-700 rounded-md">
                     <label className="flex items-center">
                        <input type="checkbox" checked={item.units.buyingUomSameAsStocking} className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-cyan-600 focus:ring-cyan-500"/>
                        <span className="ml-2 text-white">Buying unit same as stocking unit</span>
                    </label>
                    {!item.units.buyingUomSameAsStocking && (
                         <div className="grid grid-cols-2 gap-4 pt-2">
                             <input placeholder="Buying Unit (if different)" value={item.units.buyingUom} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white"/>
                             <input placeholder="Buying Relationship" value={item.units.buyingRelationship} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white"/>
                         </div>
                    )}
                </div>
             </div>
        );
      case 'Pricing':
         return (
             <div className="overflow-x-auto rounded-lg border border-gray-700/50">
                 <table className="min-w-full divide-y divide-gray-700/50 text-sm">
                     <thead className="bg-gray-800/50">
                         <tr>
                             <th className="px-4 py-3 text-left font-medium text-gray-300">Price List</th>
                             <th className="px-4 py-3 text-right font-medium text-gray-300">Price Per Selling Unit</th>
                             <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Delete</span></th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-800 bg-gray-900">
                         {item.pricing.map((p, index) => (
                             <tr key={index}>
                                 <td className="px-4 py-3"><input value={p.listName} className="w-full bg-transparent text-white" /></td>
                                 <td className="px-4 py-3"><input type="number" value={p.price} className="w-full bg-transparent text-right text-white" /></td>
                                 <td className="py-3 pl-3 pr-4 text-right"><button className="text-red-500 hover:text-red-400"><Trash2Icon className="h-4 w-4"/></button></td>
                             </tr>
                         ))}
                          <tr>
                             <td colSpan={3} className="px-4 py-2">
                                <button className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 text-sm">
                                    <PlusCircleIcon className="w-4 h-4" />
                                    <span>Add Price List</span>
                                </button>
                            </td>
                         </tr>
                     </tbody>
                 </table>
             </div>
        );
      case 'Vendors':
        return (
            <div>
                <label className="font-semibold text-gray-400 block mb-1">Preferred Vendor</label>
                <select value={item.preferredVendorId} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white">
                    <option value="">-- Select Vendor --</option>
                    {mockVendors.filter(v => v.status === 'Active').map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
            </div>
        );
      case 'Linked Account':
        return (
            <div className="grid grid-cols-2 gap-4">
                {(['assetAccountId', 'revenueAccountId', 'cogsAccountId', 'varianceAccountId'] as const).map(accType => (
                    <div key={accType}>
                        <label className="font-semibold text-gray-400 block mb-1 capitalize">{accType.replace('Id', '').replace('Account', ' Account')}:</label>
                        <select value={item.linkedAccounts[accType]} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white">
                            <option value="">-- Select Account --</option>
                            {mockChartOfAccounts.map(acc => <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>)}
                        </select>
                    </div>
                ))}
            </div>
        );
      case 'Taxes':
        return (
            <div className="space-y-3">
                <label className="flex items-center">
                    <input type="checkbox" checked={item.taxes.ppn11} className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-cyan-600 focus:ring-cyan-500"/>
                    <span className="ml-2 text-white">PPN 11% (11.00%)</span>
                </label>
                 <label className="flex items-center">
                    <input type="checkbox" checked={item.taxes.exemptPpn} className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-cyan-600 focus:ring-cyan-500"/>
                    <span className="ml-2 text-white">Exempt PPN 11%</span>
                </label>
            </div>
        );
        case 'Description':
            return <textarea value={item.description} rows={8} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white" />;
      default:
        return <div className="text-gray-500">{activeTab} tab content goes here.</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        <div className="p-6 border-b border-gray-700/50">
            <div className="grid grid-cols-3 gap-6">
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Number:</label>
                    <input type="text" name="itemNumber" value={item.itemNumber} onChange={handleHeaderChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Item Name:</label>
                    <input type="text" name="itemName" value={item.itemName} onChange={handleHeaderChange} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500"/>
                </div>
                 <div>
                    <label className="font-semibold text-gray-400 block mb-1">Type:</label>
                    <div className="flex items-center space-x-4 pt-2">
                        <label className="flex items-center"><input type="radio" name="type" value="Inventory" checked={item.type === 'Inventory'} onChange={handleHeaderChange} className="h-4 w-4 bg-gray-800 border-gray-600 text-cyan-600 focus:ring-cyan-500" /><span className="ml-2 text-white">Inventory</span></label>
                        <label className="flex items-center"><input type="radio" name="type" value="Service" checked={item.type === 'Service'} onChange={handleHeaderChange} className="h-4 w-4 bg-gray-800 border-gray-600 text-cyan-600 focus:ring-cyan-500" /><span className="ml-2 text-white">Service</span></label>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="px-6 border-b border-gray-700/50">
            <div className="flex space-x-2">
                {TABS.map(tab => <TabButton key={tab} label={tab} activeTab={activeTab} onClick={setActiveTab} />)}
            </div>
        </div>

        <div className="p-6 space-y-6 flex-grow text-sm">
            {renderTabContent()}
        </div>

        <div className="p-6 bg-gray-900 border-t border-gray-700/50 mt-auto sticky bottom-0">
            <div className="flex items-center justify-end space-x-4">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Cancel</button>
                <button disabled={!isProcessable} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed">Process</button>
            </div>
        </div>
    </div>
  );
};


const InventoryPage: React.FC = () => {
    const [items, setItems] = useState<InventoryItem[]>(mockInventoryItems);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(items[0]);

    const handleSelectItem = (item: InventoryItem) => {
        setSelectedItem(item);
    };

    const handleCreateNewItem = () => {
        const newItem: InventoryItem = {
            id: `inv_${new Date().getTime()}`,
            itemNumber: '',
            itemName: '',
            type: 'Inventory',
            status: 'Active',
            quantitiesPerLocation: [],
            units: {
                stockingUom: 'pcs',
                sellingUomSameAsStocking: true, sellingUom: 'pcs', sellingRelationship: '',
                buyingUomSameAsStocking: true, buyingUom: 'pcs', buyingRelationship: ''
            },
            pricing: [{ listName: 'Reguler', price: 0 }],
            preferredVendorId: '',
            linkedAccounts: { assetAccountId: '', revenueAccountId: '', cogsAccountId: '', varianceAccountId: ''},
            buildItems: [],
            taxes: { ppn11: true, exemptPpn: false },
            description: '',
            picture: { main: '', thumbnail: '' }
        };
        setItems(prev => [newItem, ...prev]);
        setSelectedItem(newItem);
    };
    
    const handleUpdateItem = (updatedItem: InventoryItem) => {
        const newItems = items.map(i => (i.id === updatedItem.id ? updatedItem : i));
        setItems(newItems);
        setSelectedItem(updatedItem);
    };

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => a.itemName.localeCompare(b.itemName));
    }, [items]);

    return (
        <div className="flex h-full">
            <div className="w-1/3 max-w-sm flex-shrink-0 bg-gray-900/70 border-r border-gray-700/50 flex flex-col">
                <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white">Inventory & Services</h2>
                        <button onClick={handleCreateNewItem} className="p-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700">
                           <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <ul className="divide-y divide-gray-800">
                        {sortedItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => handleSelectItem(item)}
                                    className={`w-full text-left p-4 transition-colors duration-150 ${
                                        selectedItem?.id === item.id ? 'bg-cyan-500/10' : 'hover:bg-gray-800/60'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-sm text-white">{item.itemName || '(New Item)'}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'Service' ? 'bg-purple-600/50 text-purple-300' : 'bg-blue-600/50 text-blue-300'}`}>
                                            {item.type}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-baseline mt-2">
                                        <p className="text-xs text-gray-500">{item.itemNumber}</p>
                                        {item.type === 'Inventory' && 
                                            <p className="text-sm font-medium text-cyan-400">
                                                {item.quantitiesPerLocation.reduce((sum, loc) => sum + loc.onHandQuantity, 0)} {item.units.stockingUom}
                                            </p>
                                        }
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
                <InventoryForm 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)}
                    onUpdate={handleUpdateItem}
                />
            </div>
        </div>
    );
};

export default InventoryPage;