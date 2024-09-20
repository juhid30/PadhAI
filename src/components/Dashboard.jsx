import React from 'react';
import Sidebar from './Sidebar'; 

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Example Card 1 */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Assignments</h2>
            <p className="text-sm text-gray-500 mt-4">Last Campaign Performance</p>
          </div>

          {/* Example Card 2 */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Attendance</h2>
            <p className="text-sm text-gray-500 mt-4">+15% increase in today's sales</p>
          </div>

          {/* Example Card 3 */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">Resume</h2>
            <p className="text-sm text-gray-500 mt-4">Last Campaign Performance</p>
          </div>
        </div>

        {/* Projects & Orders Overview */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {/* Projects Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <ul>
              <li className="mb-4">
                <p className="font-semibold">Material UI XD Version</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Members: 4</p>
                  <p className="text-sm text-gray-500">Budget: $14,000</p>
                  <p className="text-sm text-green-500">Completion: 70%</p>
                </div>
              </li>
              {/* Repeat this block for other projects */}
            </ul>
          </div>

          {/* Orders Overview Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Orders Overview</h2>
            <ul>
              <li className="mb-4">
                <p className="text-green-500 font-semibold">+$2400, Design Changes</p>
                <p className="text-sm text-gray-500">22 Dec 7:20 PM</p>
              </li>
              {/* Repeat this block for other orders */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
