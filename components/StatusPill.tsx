import React from 'react';

// FIX: Add 'Processed' and 'Cancelled' to the Status type to support Purchase Order statuses and resolve type errors.
// UPDATE: Add PI statuses
type Status = 'Draft' | 'Submitted' | 'Reviewed' | 'Approved' | 'Rejected' | 'In Progress' | 'Paid' | 'Processed' | 'Cancelled' | 'Overdue';

interface StatusPillProps {
  status: Status;
}

const statusColors: Record<Status, string> = {
  Draft: 'bg-gray-600/50 text-gray-300 ring-gray-500/50',
  Submitted: 'bg-blue-600/50 text-blue-300 ring-blue-500/50',
  Reviewed: 'bg-yellow-600/50 text-yellow-300 ring-yellow-500/50',
  Approved: 'bg-green-600/50 text-green-300 ring-green-500/50',
  Rejected: 'bg-red-600/50 text-red-300 ring-red-500/50',
  'In Progress': 'bg-purple-600/50 text-purple-300 ring-purple-500/50',
  Paid: 'bg-teal-600/50 text-teal-300 ring-teal-500/50',
  Processed: 'bg-purple-600/50 text-purple-300 ring-purple-500/50',
  Cancelled: 'bg-gray-700/60 text-gray-400 ring-gray-600/60',
  Overdue: 'bg-orange-600/50 text-orange-300 ring-orange-500/50'
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const colorClasses = statusColors[status] || 'bg-gray-600 text-gray-300';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${colorClasses}`}
    >
      {status}
    </span>
  );
};

export default StatusPill;
