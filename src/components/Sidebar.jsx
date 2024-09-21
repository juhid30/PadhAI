import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const isStudent = true; // Change this to false for teacher routes

  const studentRoutes = [
    { path: '/assignment-submission', name: 'Assignment Submission' },
    { path: '/plagiarism-checker', name: 'Plagiarism Checker' },
    { path: '/book-list', name: 'Book List' },
    { path: '/borrowed-books', name: 'Borrowed Books' },
    { path: '/calendar', name: 'Calendar' },
    { path: '/coding-platform', name: 'Coding Platform' },
    { path: '/notes', name: 'Notes' },
    { path: '/rooms', name: 'Rooms' },
    { path: '/skills', name: 'Skills' },
    { path: '/roadmap', name: 'Roadmap' },
  ];

  const teacherRoutes = [
    { path: '/exam-scheduler', name: 'Exam Scheduler' },
    { path: '/upload-notes', name: 'Upload Notes' },
    { path: '/upload-listing', name: 'Upload Listing' },
    { path: '/add-assignment', name: 'Add Assignment' },
    { path: '/teacher-assignment-view', name: 'Teacher Assignment View' },
  ];

  // Use the appropriate routes based on the user type
  const routes = isStudent ? studentRoutes : teacherRoutes;

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


      {/* Navigation Links */}
      <nav className="space-y-4">
        <ul>
          {routes.map((route) => (
            <li key={route.path}>
              <button
                onClick={() => navigate(route.path)}
                className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700 w-full text-left mt-3"
              >
                <span>{route.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <button className="flex items-center space-x-2 p-2 bg-gray-800 rounded-md hover:bg-gray-700 w-full text-left">
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
