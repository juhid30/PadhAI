import React from 'react'
import Sidebar from './Sidebar'
import TeacherSidebar from './TeacherSidebar'

const TeacherDashboard = () => {
  return (
    <div className='flex w-screen h-screen'>
      {/* Sidebar */}
      <div className="flex w-64">
        <TeacherSidebar />
      </div>

      {/* Main Dashboard Section */}
      <div className="flex bg-red-200 w-full h-full">
        <div className='flex flex-col w-1/2 h-full'>
          {/* First Row (Upper Part) */}
          <div className="flex w-full h-1/2 bg-green-200 relative items-center justify-center">
            <div className='w-[86%] h-[86%] bg-green-500 flex items-center justify-center'>
              {/* Centered Text */}
              <div className='text-white text-center h-full w-full flex items-center justify-center'>
                <img src="https://firebasestorage.googleapis.com/v0/b/webcade2024.appspot.com/o/Cream%20and%20Orange%20Flat%20Organic%20Upload%20Your%20Art%20Canvas%20Button%20.png?alt=media&token=91c01676-f067-4023-83b2-d6d4a5a61f19" alt="" srcset="" className='h-[100%]' />
              </div>
            </div>
          </div>

          {/* Second Row (Lower Part) */}
          <div className="flex w-full h-1/2 bg-yellow-200 relative items-center justify-center">
            <div className='w-[86%] h-[86%] bg-pink-500 flex items-center justify-center'>
              {/* Centered Text */}
              <div className='text-white text-center'>
                I need a div here which is 50% height and width of the parent div and is colored pink
              </div>
            </div>
          </div>
        </div>

        {/* Empty Right Section */}
        <div className='flex w-1/2 h-full'></div>
      </div>
    </div>
  )
}

export default TeacherDashboard;
