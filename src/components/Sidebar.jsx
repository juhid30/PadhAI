import React from 'react';


const Sidebar = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white w-64 p-5">
      {/* Logo and User Info */}
      <div className="flex items-center mb-10">
        <div className="bg-purple-600 p-3 rounded-lg">
          <span className="text-2xl font-bold">CL</span>
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-semibold">Codinglab</h2>
          <p className="text-sm text-gray-400">Web developer</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="bg-gray-800 w-full p-2 rounded-md placeholder-gray-500 text-white"
        />
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4">
        <a href="#dashboard" className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700">
          <i className="ri-home-line"></i>
          <span>Dashboard</span>
        </a>
        <a href="#revenue" className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700">
          <i className="ri-bar-chart-line"></i>
          <span>Revenue</span>
        </a>
        <a href="#notifications" className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700">
          <i className="ri-notification-line"></i>
          <span>Notifications</span>
        </a>
        <a href="#analytics" className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700">
          <i className="ri-line-chart-line"></i>
          <span>Analytics</span>
        </a>
        <a href="#likes" className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700">
          <i className="ri-heart-line"></i>
          <span>Likes</span>
        </a>
        <a href="#wallets" className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700">
          <i className="ri-wallet-line"></i>
          <span>Wallets</span>
        </a>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <a href="#logout" className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700">
          <i className="ri-logout-box-line"></i>
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
