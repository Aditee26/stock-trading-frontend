import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Total Stocks</h2>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Total Transactions</h2>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;