import React, { useState, useMemo } from 'react';
import { mockVendors, Vendor } from '../data/mockData';
import StatusPill from '../components/StatusPill';
import { PlusCircleIcon } from '../components/icons';

const VendorForm: React.FC<{
  vendor: Vendor | null;
  onClose: () => void;
  onUpdate: (vendor: Vendor) => void;
}> = ({ vendor, onClose, onUpdate }) => {
  if (!vendor) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-800/50 p-8 text-gray-500">
            <div className="text-center">
                <h2 className="text-xl font-semibold">Select a Vendor</h2>
                <p>Select a vendor from the list to view their details, or create a new one.</p>
            </div>
        </div>
    );
  }

  const isEditable = true; // For this mock-up, always allow editing

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      onUpdate({ ...vendor, [name]: value });
  };
  
  return (
    <div className="flex-1 flex flex-col bg-gray-900 overflow-y-auto">
        <div className="p-6 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-white">{vendor.name || 'New Vendor'}</h2>
                    <p className="text-sm text-gray-400">Default Terms: {vendor.paymentTerms}</p>
                </div>
                <StatusPill status={vendor.status === 'Active' ? 'Approved' : 'Rejected'} />
            </div>
        </div>

        <div className="p-6 space-y-6 flex-grow text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Vendor Name:</label>
                    <input type="text" name="name" value={vendor.name} onChange={handleChange} disabled={!isEditable} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-800"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Payment Terms:</label>
                    <input type="text" name="paymentTerms" value={vendor.paymentTerms} onChange={handleChange} disabled={!isEditable} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-800"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Contact Person:</label>
                    <input type="text" name="contactPerson" value={vendor.contactPerson} onChange={handleChange} disabled={!isEditable} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-800"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Email:</label>
                    <input type="email" name="email" value={vendor.email} onChange={handleChange} disabled={!isEditable} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-800"/>
                </div>
                <div>
                    <label className="font-semibold text-gray-400 block mb-1">Phone:</label>
                    <input type="tel" name="phone" value={vendor.phone} onChange={handleChange} disabled={!isEditable} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-800"/>
                </div>
                <div className="col-span-full">
                    <label className="font-semibold text-gray-400 block mb-1">Address:</label>
                    <textarea name="address" value={vendor.address} onChange={handleChange} disabled={!isEditable} rows={3} className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-1.5 px-3 text-white focus:ring-cyan-500 focus:border-cyan-500 disabled:bg-gray-800"/>
                </div>
            </div>
        </div>

        <div className="p-6 bg-gray-900 border-t border-gray-700/50 mt-auto sticky bottom-0">
            <div className="flex items-center justify-end space-x-4">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 rounded-md hover:bg-gray-700">Close</button>
                { isEditable && <button className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700">Save Vendor</button> }
            </div>
        </div>
    </div>
  );
};

const VendorsPage: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(vendors[0]);

    const handleSelectVendor = (vendor: Vendor) => {
        setSelectedVendor(vendor);
    };

    const handleCreateNewVendor = () => {
        const newVendor: Vendor = {
            id: `ven_${new Date().getTime()}`,
            name: '',
            paymentTerms: 'TRANSFER 14D',
            address: '',
            contactPerson: '',
            email: '',
            phone: '',
            status: 'Active',
        };
        setVendors(prev => [newVendor, ...prev]);
        setSelectedVendor(newVendor);
    };
    
    const handleUpdateVendor = (updatedVendor: Vendor) => {
        const newVendors = vendors.map(v => (v.id === updatedVendor.id ? updatedVendor : v));
        setVendors(newVendors);
        setSelectedVendor(updatedVendor);
    };

    const sortedVendors = useMemo(() => {
        return [...vendors].sort((a, b) => a.name.localeCompare(b.name));
    }, [vendors]);

    return (
        <div className="flex h-full">
            <div className="w-1/3 max-w-sm flex-shrink-0 bg-gray-900/70 border-r border-gray-700/50 flex flex-col">
                <div className="p-4 border-b border-gray-700/50 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg font-bold text-white">Vendors</h2>
                        <button onClick={handleCreateNewVendor} className="p-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700">
                           <PlusCircleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-grow">
                    <ul className="divide-y divide-gray-800">
                        {sortedVendors.map(ven => (
                            <li key={ven.id}>
                                <button
                                    onClick={() => handleSelectVendor(ven)}
                                    className={`w-full text-left p-4 transition-colors duration-150 ${
                                        selectedVendor?.id === ven.id ? 'bg-cyan-500/10' : 'hover:bg-gray-800/60'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-sm text-white">{ven.name}</p>
                                        <StatusPill status={ven.status === 'Active' ? 'Approved' : 'Rejected'} />
                                    </div>
                                    <div className="flex justify-between items-baseline mt-2">
                                        <p className="text-xs text-gray-500">{ven.contactPerson}</p>
                                        <p className="text-sm font-medium text-gray-400">{ven.paymentTerms}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
                <VendorForm
                    vendor={selectedVendor}
                    onClose={() => setSelectedVendor(null)}
                    onUpdate={handleUpdateVendor}
                />
            </div>
        </div>
    );
};

export default VendorsPage;