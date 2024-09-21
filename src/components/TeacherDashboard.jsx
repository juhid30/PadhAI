import React from 'react';
import TeacherSidebar from './TeacherSidebar';

const TeacherDashboard = () => {
  // Sample schedule data
  const schedule = [
    {
      date: 'September 21, 2024',
      classes: [
        { batch: 'SE C1', time: '9:00 AM - 10:00 AM' },
        { batch: 'TE C1', time: '10:00 AM - 11:00 AM' },
        { batch: 'TE C3', time: '11:00 AM - 12:00 PM' }
      ]
    },
    {
      date: 'September 22, 2024',
      classes: [
        { batch: 'BE C2', time: '9:00 AM - 10:00 AM' },
        { batch: 'TE C2', time: '10:00 AM - 11:00 AM' },
        { batch: 'SE C3', time: '11:00 AM - 12:00 PM' }
      ]
    },
    {
      date: 'September 23, 2024', // New date added
      classes: [
        { batch: 'SE C2', time: '9:00 AM - 10:00 AM' },
        { batch: 'BE C3', time: '10:00 AM - 11:00 AM' },
        { batch: 'BE C1', time: '11:00 AM - 12:00 PM' }
      ]
    }
  ];

  return (
    <div className='flex w-screen h-screen'>
      {/* Sidebar */}
      <div className="flex w-64">
        <TeacherSidebar />
      </div>

      {/* Main Dashboard Section */}
      <div className="flex w-full h-full">
        <div className='flex flex-col w-1/2 h-full'>
          {/* First Row (Upper Part) */}
          <div 
            className="flex w-full h-1/2relative items-center justify-center cursor-pointer"
            onClick={() => window.location.href = '/add-assignment'} // Direct navigation
          >
            <div className='w-[86%] h-[86%] border-4 border-indigo-800 flex items-center justify-center relative'>
              {/* Full-Space Image */}
              <img 
                src="../book.jpg" 
                alt="Upload Assignment" 
                className='w-full h-full object-cover rounded-lg' 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-blue-800 bg-opacity-0 hover:bg-opacity-75 transition duration-300 ease-in-out">
                <span className='text-white text-2xl font-bold opacity-0 hover:opacity-100 transition duration-300 ease-in-out'>Upload Assignment</span>
              </div>
            </div>
          </div>

          {/* Second Row (Lower Part) */}
          <div className="flex w-full h-1/2  relative items-center justify-center">
            <div className='w-[86%] h-[86%] border-4 800horder-indigo-600 flex items-center justify-center relative'>
              {/* Full-Space Image */}
              <img 
                src="../building.jpg" // Replace with your image URL
                alt="Description" 
                className='w-full h-full object-fill rounded-lg' 
              />
              <div className="absolute inset-0 flex items-center justify-center bg-blue-800 bg-opacity-0 hover:bg-opacity-75 transition duration-300 ease-in-out">
                <span className='text-white text-2xl font-bold opacity-0 hover:opacity-100 transition duration-300 ease-in-out'>Upload upcoming internship</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Right Section with border and margin */}
        <div className='flex w-1/2 h-full p-4'>
          <div className='flex flex-col w-full h-full overflow-y-auto bg-blue-100 border border-b border-zinc-500 border-gray-300 rounded-lg shadow-md p-4'>
            {/* Sticky Header */}
            <div className='sticky top-0 bg-blue-100 bg-opacity-70 border-b border-blue-800 z-10'>
              <h2 className='text-xl font-semibold text-blue-950'>Schedule</h2>
            </div>

            {schedule.map((day, index) => (
              <div key={index} className='mb-6'>
                {/* Date Header */}
                <h2 className='text-xl text-blue-950 font-semibold mb-2'>{day.date}</h2>
                <hr className='border-blue-800 mb-4' />
                {/* Class Batches */}
                {day.classes.map((classInfo, idx) => (
                  <div
                    key={idx}
                    className='flex justify-between items-center p-3 mb-2 bg-neutral-100 rounded-md shadow-sm border border-gray-300'
                  >
                    <span className='font-bold text-blue-900 text-lg'>{classInfo.batch}</span>
                    <span className='text-sm'>{classInfo.time}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
