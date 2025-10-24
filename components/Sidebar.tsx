import React from 'react';
import { Page } from '../App';
import { BotMessageSquareIcon, FileTextIcon, ShoppingCartIcon, ArchiveIcon, Building2Icon, SettingsIcon, LayoutDashboardIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  page: Page;
  currentPage: Page;
  onClick: (page: Page) => void;
}> = ({ icon, label, page, currentPage, onClick }) => {
  const isActive = currentPage === page || (currentPage === 'pr-form' && page === 'pr-list');
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-cyan-500/10 text-cyan-400'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-700/50 p-4 flex flex-col">
      <div className="flex items-center space-x-3 px-2 mb-6">
         <BotMessageSquareIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-lg font-bold text-gray-100 whitespace-nowrap">
          AN-NAML Purchases
        </h1>
      </div>
      <nav className="flex-1 space-y-2">
        <NavItem
          icon={<LayoutDashboardIcon className="w-5 h-5" />}
          label="Dashboard"
          page="dashboard"
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <div className="px-4 pt-4 pb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Purchasing</span>
        </div>
        <NavItem
          icon={<FileTextIcon className="w-5 h-5" />}
          label="Purchase Requests"
          page="pr-list"
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          icon={<ShoppingCartIcon className="w-5 h-5" />}
          label="Purchase Orders"
          page="po"
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          icon={<ArchiveIcon className="w-5 h-5" />}
          label="Purchase Invoices"
          page="pi"
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
         <div className="px-4 pt-4 pb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Management</span>
        </div>
         <NavItem
          icon={<ArchiveIcon className="w-5 h-5" />}
          label="Inventory"
          page="inventory"
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
        <NavItem
          icon={<Building2Icon className="w-5 h-5" />}
          label="Vendors"
          page="vendors"
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
      </nav>
      <div className="mt-auto">
        <NavItem
          icon={<SettingsIcon className="w-5 h-5" />}
          label="Settings"
          page="settings"
          currentPage={currentPage}
          onClick={setCurrentPage}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
