import React, { useState } from 'react';
import StatusTag from './StatusTag';

export default function TaskCard({ task, onUpdateStatus, showDropdown = false }) {
  const [selectedStatus, setSelectedStatus] = useState(task.status);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    onUpdateStatus(newStatus);  // Call the passed onUpdateStatus function
    setIsEditing(false);

    // Show the alert notification
    alert('Task status updated successfully!');
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <StatusTag status={task.status} />
      </div>
      <p className="text-gray-600 text-sm mb-2">{task.description}</p>
      <p className="text-xs text-gray-400">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>

      {showDropdown && !isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="mt-3 bg-blue-500 text-white px-4 py-1 rounded text-sm hover:bg-blue-600"
        >
          Update Status
        </button>
      )}

      {showDropdown && isEditing && (
        <div className="mt-3">
          <label className="block text-sm text-gray-600 mb-1">Select New Status:</label>
          <select
            value={selectedStatus}
            onChange={handleChange}
            className="border p-2 rounded text-sm w-full"
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
      )}
    </div>
  );
}
