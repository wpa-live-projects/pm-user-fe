// components/StatusTag.jsx
import React from 'react';

const statusColors = {
  'To Do': 'bg-gray-300 text-gray-700',
  'In Progress': 'bg-yellow-300 text-yellow-800',
  'Done': 'bg-green-400 text-green-900',
};

export default function StatusTag({ status }) {
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[status] || 'bg-gray-200 text-gray-700'}`}>
      {status}
    </span>
  );
}
